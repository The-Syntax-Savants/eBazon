const express = require("express");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils.js");
const { createUser, getUserById, getAllUsers, getUser } = require("../db/users.js");
const { user } = require("pg/lib/defaults.js");

const usersRouter = express.Router();

usersRouter.use((req, res, next)=>
{
    console.log("A request is being made to /users");

    next();
});

// GET /api/users/
usersRouter.get("/", async (req, res)=>
{
    const users = await getAllUsers();

    res.send({
        users 
    });
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
    try {
      const { username, password, email, first_name, last_name } = req.body;
      const _user = await getUser(username);
  
      if (_user) {
        res.status(401);
        next({
          message: "Username is already taken",
          name: "UserAlreadyExist",
        });
      } else if (password.length < 8) {
          res.status(401);
        next({
          message: "Password must be at least 8 characters",
          name: "PasswordToShort",
        });
      } else {
        const user = await createUser({
          username,
          password,
          email,
          first_name,
          last_name
        });
  
        const token = jwt.sign(
          {
            id: user.id,
            username,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1w",
          }
        );

        if (user.password) {
            delete user.password;
        }
  
        res.send({
          user,
          message: "thank you for signing up",
          token,
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


// POST /api/users/login
usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const _user = await getUser(username);

    if (_user && user.password === password) {
      
    }
    
  } catch ({name, message}) {
    next({name, message})
  }
})

module.exports = usersRouter;