import express from "express";
import {
  addMoneyToAccount,
  createAccount,
  DeleteMoneyToAccount,
  getAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id?", authMiddleware, getAccounts);
router.post("/create", authMiddleware, createAccount);
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);
router.delete("/delete-money/:id", authMiddleware, DeleteMoneyToAccount);
export default router;
