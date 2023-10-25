const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {GITHUB_CLIENT_ID,GITHUB_CLIENT_SECRET} = process.env;

const axios = require("axios");

// Register a new instructor account
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 8);
    const instructor = await prisma.instructor.create({
      data: {
        username,
        password:hashedPassword,
      },
    });

    // Create a token with the instructor id
    const token = jwt.sign({ id: instructor.id }, process.env.JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing instructor account
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

 // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const instructor = await prisma.instructor.findUnique({
      where: {
        username: username,
      },
    });
    console.log(instructor)
    if (!instructor) {
      return res.status(401).send("Invalid login credentials.");
    }

    const hashedPassword = instructor.password;
    const pwMatch = await bcrypt.compare(password, hashedPassword);
    console.log(pwMatch);

        if (pwMatch) {
      const token = jwt.sign({ id: instructor.id }, process.env.JWT);
      res.send({ token });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });}

   
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in instructor
router.get("/me", async (req, res, next) => {
  try {
    const {
      rows: [instructor],
    } = await db.query("SELECT * FROM instructor WHERE id = $1", [
      req.user?.id,
    ]);

    res.send(instructor);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
