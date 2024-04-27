import { Router } from "express";
import client from "../config/prisma.client.js";

import { getError } from "../utils/prisma.errors.js";
import { v4 as uuidV4 } from "uuid";
import jwt from "jsonwebtoken";

const secret = "XXX_CHESS_APP";
const rid = () => crypto.randomUUID().slice(0, 5);

const router = Router();

router.post("/login", async (req, res) => {
  const { userName, displayName = `Guest ${rid()}`, password } = req.body;
  const pk = uuidV4();

  try {
    const foundUser = await client.user.findFirst({
      where: { userName, password },
    });

    if (foundUser) {
      const foundUserToken = jwt.sign(foundUser, secret);
      return res.json({
        success: true,
        response: foundUser,
        token: foundUserToken,
        message: "Login successfull",
      });
    }

    // ..if user not found
    const isUserNameAvailable = await checkUsername(userName);

    if (!isUserNameAvailable.success) {
      return res.json({ success: false, message: isUserNameAvailable.message });
    }

    const newUser = await client.user.create({
      data: { userName, displayName, password, pk },
    });
    const newUserToken = jwt.sign(newUser, secret);

    res.json({
      success: true,
      response: newUser,
      newUserToken,
      message: "User created",
    });
  } catch (error) {
    getError(error, res);
  }
});

const checkUsername = async (userName) => {
  try {
    const usersWithSameName = await client.user.findFirst({
      where: { userName },
    });
    if (usersWithSameName?.pk) {
      return { success: false, message: "Username already taken" };
    }
    return { success: true, message: "Username Available" };
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, msg: error });
  }
};

export default router;
