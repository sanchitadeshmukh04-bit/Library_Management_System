const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const Book = require("../models/Book");
const Member = require("../models/Member");

// ISSUE BOOK
router.post("/issue", async (req, res) => {
  try {
    const { bookId, memberId } = req.body;

    // Check book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Check member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    // Check availability
    if (book.available <= 0) {
      return res.status(400).json({
        message: "Book is not available",
      });
    }

    // Create transaction
    const transaction = new Transaction({
      book: bookId,
      member: memberId,
    });

    const savedTransaction = await transaction.save();

    // Decrease available books
    book.available = book.available - 1;
    await book.save();

    res.status(201).json({
      message: "Book issued successfully",
      transaction: savedTransaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to issue book",
      error: error.message,
    });
  }
});

// GET ALL TRANSACTIONS
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("book")
      .populate("member")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
});

// RETURN BOOK
router.put("/return/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    if (transaction.status === "Returned") {
      return res.status(400).json({
        message: "Book has already been returned",
      });
    }

    // Update transaction
    transaction.status = "Returned";
    transaction.returnDate = new Date();

    await transaction.save();

    // Increase available books
    const book = await Book.findById(transaction.book);

    if (book) {
      book.available = book.available + 1;
      await book.save();
    }

    res.status(200).json({
      message: "Book returned successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to return book",
      error: error.message,
    });
  }
});

module.exports = router;