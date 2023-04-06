import express from "express";
import jwt from "jsonwebtoken";
import { requireUser, requireAdmin } from "./utils.js";
import {
  createUser,
  getUserById,
  getAllUsers,
  getUser,
  updateUser,
} from "../db/users.js";
import bcrypt from "bcrypt";

export const usersRouter = express.Router();
export default usersRouter;

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

// GET /api/users/          
//If we do a search bar to look for users in the future, we might have to remove requireAdmin from this route. For now it stays
usersRouter.get("/", requireAdmin,  async (req, res) => {
  try{
    const users = await getAllUsers();

    if (users) {
      res.send({
        users,
      }); 
    } else {
      next({
        name: "ErrorGettingAllUsers",
        message: "I really don't know what could be going wrong here. api -> usersRouter.get(\"/\") "
      })
    }
  
    
  }catch ({name, message}) {
    next({
      name, message
    })
  }
});

usersRouter.get("/me", requireUser, async (req, res, next) => {
  try {
    if (!req.user) {
      next({
        name: "ErrorUser",
        message: "Need to log in",
      });
    } else {
      delete req.user.password;
      res.send(req.user);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//Used so that an admin can see another users profile data
usersRouter.get("/:userId", requireAdmin, async (req, res, next) => {
  try{
    const { userId: id } = req.params;
    const user = await getUserById(id)
    if (user) {
      res.send(user)
    } else {
      next({
        name: "ErrorFindingUser",
        message: "A user with that id does not exist"
      })
    }
  }catch ({name, message}) {
    next({name, message})
  } 
})

// POST /api/users/register
usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password, email, first_name, last_name } = req.body;
    const is_admin = false;
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
        is_admin,
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
    console.log(req.body);
    const { username, password } = req.body;
    const user = await getUser(username);
    const hashedPassword = user.password;
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (user && isValid) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET
      );
      res.send({
        token: token,
      });
    } else {
      next({
        name: "ErrorIncorrectCredentials",
        message: "Username or Password is incorrect",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.patch(
  "/:username/profile/edit",
  requireUser,
  async (req, res, next) => {
    try {
      const { username } = req.params;
      const SALT_COUNT = 10;

      const info = req.body;
      if (req.user) {
        info.id = req.user.id;
      }
      if(info.password.length){
        hashedPassword = await bcrypt.hash(info.password, SALT_COUNT);
      }
      if (info.is_admin) {
        delete info.is_admin;
      }
      if(info.password.length){
        info.password = hashedPassword;
        console.log(hashedPassword, "HASHED")
        console.log(info.password, "INFO PASS")
      }else{
        delete info.password
      }
      info.username = username;
      const update = await updateUser(info);
      if (update) {
        res.send(update);
      } else {
        next({
          name: "ErrorUserDoesNotExist",
          message: "This user does not exist",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

// usersRouter.patch(
//   "/:username/profile/edit",
//   requireUser,
//   async (req, res, next) => {
//     try {
//       const { username } = req.params;
//       const SALT_COUNT = 10;

//       const info = req.body;
//       if (req.user) {
//         info.id = req.user.id;
//       }
//       hashedPassword = await bcrypt.hash(info.password, SALT_COUNT);
//       if (info.is_admin) {
//         delete info.is_admin;
//       }
//       info.password = hashedPassword;
//       info.username = username;
//       console.log(info, "!!!!!!!");
//       const update = await updateUser(info);
//       if (update) {
//         res.send(update);
//       } else {
//         next({
//           name: "ErrorUserDoesNotExist",
//           message: "This user does not exist",
//         });
//       }
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   }
// );
