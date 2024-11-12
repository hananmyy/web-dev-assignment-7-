// importing mysql
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { promisify } = require("util");

// importing the database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// LOGIN FUNCTION
const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).render("login", {
        message: "Please provide a username/email and password",
      });
    }

    // Check in admin table
    db.query(
      "SELECT * FROM admin WHERE username = ?",
      [usernameOrEmail],
      async (error, results) => {
        if (error) {
          console.error("Database query error:", error);
          return res.status(500).render("login", {
            message: "Internal server error",
          });
        }

        if (results.length > 0) {
          // Admin found, check password
          if (!(await bcrypt.compare(password, results[0].password))) {
            return res.status(401).render("login", {
              message: "Username or Password is incorrect",
            });
          }

          // Create JWT token for admin
          const id = results[0].admin_id;
          const token = jwt.sign(
            { id, role: "admin" },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          return res.status(200).redirect("/admin-dashboard");
        }

        // Check in patients table
        db.query(
          "SELECT * FROM patients WHERE email = ?",
          [usernameOrEmail],
          async (error, results) => {
            if (error) {
              console.error("Database query error:", error);
              return res.status(500).render("login", {
                message: "Internal server error",
              });
            }

            if (
              !results ||
              results.length === 0 ||
              !(await bcrypt.compare(password, results[0].password_hash))
            ) {
              return res.status(401).render("login", {
                message: "Email or Password is incorrect",
              });
            }

            // Create JWT token for patient
            const id = results[0].patient_id;
            const token = jwt.sign(
              { id, role: "patient" },
              process.env.JWT_SECRET,
              {
                expiresIn: process.env.JWT_EXPIRES_IN,
              }
            );

            const cookieOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
              httpOnly: true,
            };

            res.cookie("jwt", token, cookieOptions);
            return res.status(200).redirect("/profile");
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).render("login", {
      message: "An error occurred during login",
    });
  }
};

// REGISTER FUNCTION
const register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password_hash,
    confirm_password,
    phone,
    date_of_birth,
    gender,
    address,
  } = req.body;

  if (!gender) {
    return res.render("register", {
      message: "Gender field cannot be empty",
    });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT email FROM patients WHERE email = ?", [email]);

    if (rows.length > 0) {
      return res.render("register", {
        message: "That email is already in use",
      });
    } else if (password_hash !== confirm_password) {
      return res.render("register", {
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 8);
    await db.promise().query("INSERT INTO patients SET ?", {
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      phone,
      date_of_birth,
      gender,
      address,
    });

    return res.render("register", {
      message: "Patient registered",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("register", {
      message: "An error occurred during registration",
    });
  }
};

// MIDDLEWARE TO CHECK IF USER IS LOGGED IN
const isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      const [result] = await db
        .promise()
        .query("SELECT * FROM patients WHERE patient_id = ?", [decoded.id]);

      if (!result || result.length === 0) {
        return next();
      }

      req.user = result[0];
      return next();
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    next();
  }
};

// LOGOUT FUNCTION
const logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).redirect("/");
};

// PROFILE ROUTE
const profile = (req, res) => {
  if (!req.user) {
    return res.status(401).redirect("/login");
  }

  res.render("profile", {
    patient: req.user,
  });
};

// UPDATE PROFILE FUNCTION
const updateProfile = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    date_of_birth,
    gender,
    address,
  } = req.body;

  try {
    await db
      .promise()
      .query(
        "UPDATE patients SET first_name = ?, last_name = ?, email = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE patient_id = ?",
        [
          first_name,
          last_name,
          email,
          phone,
          date_of_birth,
          gender,
          address,
          req.user.patient_id,
        ]
      );

    return res.status(200).send("Profile updated successfully!");
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send("An error occurred while updating the profile.");
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return res.status(403).send("Access denied.");
  }
};

// Export all functions
module.exports = {
  login, 
  register,
  isLoggedIn,
  logout,
  profile,
  updateProfile,
  isAdmin,
};
