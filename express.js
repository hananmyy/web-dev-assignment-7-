const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// Parsing URL-encoded bodies(as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

db.connect((err) => {
  if (err) {
    console.log("Error connecting to the db:", err.stack);
    return;
  }

  console.log("Successfully connected to the db");
});

const port = 3500;

// patients table

/*app.get("/createTable", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS patients (
        patient_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  db.query(sql, (err) => {
    if (err) {
      console.log("Error creating patients table:", err);
      return res
        .status(500)
        .send(
          "Error creating patients table. Check the server logs for more information."
        );
    }

    console.log("Patients table created successfully:, result");

    res.send("Patients table created successfully");
  });
});*/

// doctors table

/*app.get("/createTable", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS doctors (
        doctor_id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        specialization VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        schedule TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  db.query(sql, (err) => {
    if (err) {
      console.log("Error creating doctors table:", err);
      return res
        .status(500)
        .send(
          "Error creating doctors table. Check the server logs for more information."
        );
    }

    console.log("Doctors table created successfully:, result");

    res.send("Doctors table created successfully");
  });
});*/

// appointments table

/*app.get("/createTable", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS appointments (
        appointment_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT(50) NOT NULL,
        doctor_id INT(50) NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE

    )
    `;

  db.query(sql, (err) => {
    if (err) {
      console.log("Error creating appointments table:", err);
      return res
        .status(500)
        .send(
          "Error creating appointments table. Check the server logs for more information."
        );
    }

    console.log("Appointments table created successfully:, result");

    res.send("Appointments table created successfully");
  });
});*/

// admin table

/*app.get("/createTable", (req, res) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS admin (
        admin_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  db.query(sql, (err) => {
    if (err) {
      console.log("Error creating admin table:", err);
      return res
        .status(500)
        .send(
          "Error creating admin table. Check the server logs for more information."
        );
    }

    console.log("Admin table created successfully:, result");

    res.send("Admin table created successfully");
  });
});*/

// creating users in patients table

/*app.get("/createUser", (req, res) => {
  const sql = `
    INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?,?,?,?,?,?,?,?)
    `;

  const values = [
    'Hanan',
    'Mohamud',
    'hananmohamudy@gmail.com',
    'hello1',
    '+254701234567',
    '1970-01-01',
    'female',
    'Nairobi'
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("Error creating user record:", err);
      return response.status(500).send("Error creating user record");
    }
    res.send("User record created successfully.");
  });
});*/

// creating users in doctors table

/*app.get("/createUser", (req, res) => {
  const sql = `
    INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?,?,?,?,?,?)
    `;

  const values = [
    'Geoffrey',
    'Nyabuto',
    'Cardiology',
    'geoffn@gmail.com',
    '+254012345678',
    'Thursday'
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("Error creating user record:", err);
      return response.status(500).send("Error creating user record");
    }
    res.send("User record created successfully.");
  });
});*/

/*app.get("/createUser", (req, res) => {
  const sql = `
    INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?,?,?,?,?,?)
    `;

  const values = [
    "Alana",
    "Imani",
    "General Surgery",
    "alanaImani@yahoo.com",
    "+254712121212",
    "Weekdays",
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("Error creating user record:", err);
      return response.status(500).send("Error creating user record");
    }
    res.send("User record created successfully.");
  });
});*/

/*app.get("/createUser", (req, res) => {
  const sql = `
    INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?,?,?,?,?,?)
    `;

  const values = [
    "Christine",
    "Wambui",
    "General Surgery",
    "christinewambui@gmail.com",
    "+254723232323",
    "Weekends",
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("Error creating user record:", err);
      return response.status(500).send("Error creating user record");
    }
    res.send("User record created successfully.");
  });
});*/

/*app.get("/createUser", (req, res) => {
  const sql = `
    INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?,?,?,?,?,?)
    `;

  const values = [
    "Mark",
    "Kimani",
    "Oncology",
    "mark.kimani@outlook.com",
    "+254723363623",
    "Weekdays",
  ];

  db.query(sql, values, (err) => {
    if (err) {
      console.log("Error creating user record:", err);
      return response.status(500).send("Error creating user record");
    }
    res.send("User record created successfully.");
  });
});*/

// creating users in admin table

//admin 1

/*const password = "hello123";
const saltRounds = 10;

// Hashing the password
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  // The hashed password can now be used in your SQL insert statement
  const sql = `
    INSERT INTO admin (username, password_hash, role) VALUES ('mercyOwino29', '${hash}', 'admin');
  `;

  // Execute the SQL query using your database connection
  // Assuming you have a db connection established:
  db.query(sql, (error) => {
    if (error) {
      console.error("Error creating Admin record:", error);
      return;
    }
    console.log("Admin record created successfully.");
  });
});*/

// admin 2

/*const password = "hello1234";
const saltRounds = 10;

// Hashing the password
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
    return;
  }

  // The hashed password can now be used in your SQL insert statement
  const sql = `
    INSERT INTO admin (username, password_hash, role) VALUES ('idrisAbdullahi', '${hash}', 'admin');
  `;

  // Execute the SQL query using your database connection
  // Assuming you have a db connection established:
  db.query(sql, (error) => {
    if (error) {
      console.error("Error creating Admin record:", error);
      return;
    }
    console.log("Admin record created successfully.");
  });
});*/

// update passwords table from NOT NULL to allow NULL values
/*app.get("/updatePasswordsToNull", (req, res) => {
  // First, modify the password_hash field to allow NULL values
  const alterTableQuery = `
    ALTER TABLE patients MODIFY password_hash VARCHAR(255) NULL;
  `;

  db.query(alterTableQuery, (alterErr) => {
    if (alterErr) {
      console.log("Error modifying password_hash field:", alterErr);
      return res
        .status(500)
        .send(
          "Error modifying password_hash field. Check the server logs for more information."
        );
    }

    console.log("password_hash field modified to allow NULL values.");

    // Then, update all existing patients to set their password_hash to NULL
    const updatePasswordsQuery = `
      UPDATE patients SET password_hash = NULL;
    `;

    db.query(updatePasswordsQuery, (updateErr, result) => {
      if (updateErr) {
        console.log("Error updating passwords to NULL:", updateErr);
        return res
          .status(500)
          .send(
            "Error updating passwords to NULL. Check the server logs for more information."
          );
      }

      console.log("Passwords updated to NULL for all patients:", result);

      res.send(
        "Passwords updated to NULL for all current patients and password_hash field allows NULL for future patients."
      );
    });
  });
});*/

/*app.get("/admin-dashboard", isLoggedIn, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).redirect("/"); // Deny access if not admin
  }
  // Fetch doctors and appointments from the database
  res.render("admin-dashboard"); // Render your admin dashboard
});*/

// Define routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
