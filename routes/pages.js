const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Assuming you're using a library like Passport.js
    return next();
  }
  res.redirect("/login"); // Redirect to login if not authenticated
};

// Render the admin dashboard (add authController.isAdmin if needed)
router.get("/admin-dashboard", authController.isLoggedIn, (req, res) => {
  // Fetch doctors and appointments from the database
  db.query("SELECT * FROM doctors", (error, doctors) => {
    if (error) {
      console.error("Error fetching doctors:", error);
      return res.status(500).send("Error fetching data");
    }
    // Similarly fetch appointments if needed
    res.render("admin-dashboard", { doctors });
  });
});

// Profile route
router.get("/profile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("profile", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/profile", isLoggedIn, (req, res) => {
  const patient_id = req.user.id; // Assuming you have the user's ID stored in req.user

  // Query the database to get the patient information
  db.query(
    "SELECT * FROM patients WHERE id = ?",
    [patient_id],
    (error, results) => {
      if (error) {
        console.error("Error fetching patient data:", error);
        return res.status(500).send("Error fetching patient data");
      }

      if (results.length > 0) {
        const patient = results[0]; // Get the first result
        res.render("profile", { patient }); // Render the profile template with patient data
      } else {
        res.status(404).send("Patient not found"); // Handle case where no patient is found
      }
    }
  );
});

// Delete account
router.post("/deleteAccount", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    const patient_Id = req.user.id;

    db.query(
      "DELETE FROM patients WHERE patient_id = ?",
      [patient_Id],
      (error) => {
        if (error) {
          console.log(error);
          return res.status(500).send("Error deleting account");
        }
        res.clearCookie("jwt"); // Clear the cookie after deleting the account
        res.redirect("/register"); // Redirect to registration or home page
      }
    );
  } else {
    res.redirect("/login");
  }
});

// Update profile
router.get("/update-profile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("update-profile", {
      user: req.user, // Pass the logged-in user's info to pre-fill the form
    });
  } else {
    res.redirect("/login");
  }
});

// Handle profile update
router.post(
  "/update-profile",
  authController.isLoggedIn,
  authController.updateProfile
);

// Add doctor route
router.post(
  "/admin/add-doctor",
  authController.isLoggedIn,
  async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
    db.query(
      "INSERT INTO doctors (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, hashedPassword],
      (error) => {
        if (error) {
          console.error("Database query error:", error);
          return res.status(500).redirect("/admin-dashboard");
        }
        res.redirect("/admin-dashboard"); // Redirect to the admin dashboard
      }
    );
  }
);

// Delete doctors route
router.post(
  "/admin/delete-doctor/:id",
  authController.isLoggedIn,
  (req, res) => {
    const doctor_id = req.params.id;
    db.query(
      "DELETE FROM doctors WHERE doctor_id = ?",
      [doctor_id],
      (error) => {
        if (error) {
          console.error("Database query error:", error);
          return res.status(500).redirect("/admin-dashboard");
        }
        res.redirect("/admin-dashboard"); // Redirect to the admin dashboard
      }
    );
  }
);

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
});

// Render register page
router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
