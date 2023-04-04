const express = require("express");
const jwt = require("jsonwebtoken");
const { requireUser } = require("./utils.js");
const { createUser, getUserById, getAllUsers, getUser, updateUser } = require("../db/users.js");
const bcrypt = require("bcrypt")

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

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    if (!req.user) {
      next({
        name: "ErrorUser",
        message: "Need to log in",
      });
    }else{
      delete req.user.password
      res.send(req.user);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
    try {
      const { username, password, email, first_name, last_name } = req.body;
      const is_admin = false
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
          last_name,
          is_admin
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
    const user = await getUser(username);
    const hashedPassword = user.password
    const isValid = await bcrypt.compare(password, hashedPassword)

    if (user && isValid) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET
      )
      res.send({
        token: token,
      })
    }else{
      next({
        name: "ErrorIncorrectCredentials",
        message: "Username or Password is incorrect"
      })
    }
    
  } catch ({name, message}) {
    next({name, message})
  }
})

usersRouter.patch("/:username/profile/edit", requireUser, async (req, res, next) => {
  try {
    const { username } = req.params;
    const SALT_COUNT = 10;

    const info = req.body;
    if(req.user){
      info.id = req.user.id
    }
    hashedPassword = await bcrypt.hash(info.password, SALT_COUNT);
    if(info.is_admin){
      delete info.is_admin 
    }
    info.password = hashedPassword;
    info.username = username;
    console.log(info, "!!!!!!!")
    const update = await updateUser(info);
    if (update) {
      res.send(update);
    } else {
      next({
        name: "ErrorUserDoesNotExist",
        message:
          "This user does not exist",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;