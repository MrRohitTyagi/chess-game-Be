import { Router } from "express";
import client from "../config/prisma.client.js";

import { applyFilters } from "../utils/utils.js";
import { getError } from "../utils/prisma.errors.js";

const router = Router();

const getuserPyload = ({
  userName,
  displayName,
  password,
  pk,
  isSearching,
}) => {
  return { userName, displayName, password, pk, isSearching };
};
export const user_fields_tO_send = { displayName: true, name: true, pk: true };

router.delete("/delete/:pk", async (req, res) => {
  const { pk } = req.params;
  try {
    await client.user.delete({ where: { pk: pk } });
    res.json({ success: true, response: "user deleted successfully" });
  } catch (error) {
    getError(error, res);
  }
});

router.put("/update/:pk", async (req, res) => {
  const { pk } = req.params;
  const body = req.body;
  try {
    const user = await client.user.update({
      where: { pk: pk },
      data: getuserPyload(body),
    });
    res.json({ success: true, response: user, body });
  } catch (error) {
    getError(error, res);
  }
});

router.get("/get-all", applyFilters, async (req, res) => {
  try {
    const users = await client.user.findMany({
      select: user_fields_tO_send,
      ...(req.filters || {}),
    });

    res.json({ success: true, response: users });
  } catch (error) {
    getError(error, res);
  }
});

router.get("/get/:pk", async (req, res) => {
  const { pk } = req.params;
  try {
    const user = await client.user.findUnique({
      where: { pk: pk },
      select: user_fields_tO_send,
    });
    res.json({ success: true, response: user });
  } catch (error) {
    getError(error, res);
  }
});

export default router;
