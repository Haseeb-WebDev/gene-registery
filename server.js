const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;
const DATA_FILE = "data.json";

app.use(cors());
app.use(express.json());

// Ensure the file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

// Function to read data from the file
const readData = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
};

// Function to write data to the file
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Route to add user data
app.post("/add", (req, res) => {
  const { name, rollNo, gene } = req.body;

  if (!name || !rollNo || !gene) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const data = readData();
  data.push({ name, rollNo, gene: gene.toUpperCase() });
  writeData(data);

  res.json({ message: "Data added successfully!" });
});

// Route to get all data
app.get("/data", (req, res) => {
  res.json(readData());
});

// Route to check if a gene is already selected
app.get("/search/:gene", (req, res) => {
  const geneToSearch = req.params.gene.toUpperCase();
  const data = readData();
  
  const found = data.some(entry => entry.gene === geneToSearch);
  res.json({ exists: found });
});

const USERS_FILE = "users.json";

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, "[]");
}

// Function to read users from the file
const readUsers = () => {
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
};

// Function to write users to the file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Route for user signup
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required!" });
  }

  const users = readUsers();
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "Username already exists!" });
  }

  users.push({ username, password });
  writeUsers(users);

  res.json({ message: "Signup successful!" });
});

// Route for user login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password!" });
  }

  res.json({ message: "Login successful!" });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
