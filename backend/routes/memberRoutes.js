const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// CREATE - Add a new member
router.post("/", async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save();

    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add member",
      error: error.message,
    });
  }
});

// READ - Get all members
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch members",
      error: error.message,
    });
  }
});

// READ - Get one member by ID
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch member",
      error: error.message,
    });
  }
});

// UPDATE - Update a member
router.put("/:id", async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update member",
      error: error.message,
    });
  }
});

// DELETE - Delete a member
router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    res.status(200).json({
      message: "Member deleted successfully",
      member: deletedMember,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete member",
      error: error.message,
    });
  }
});

module.exports = router;