const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { authenticate, SECRET } = require("../middleware/auth");

router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      SECRET,
      { expiresIn: "1d" }
    );
    res.json({
      token,
      user: { id: user._id, role: user.role, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/events", authenticate, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const count = await Registration.countDocuments({ event: event._id });
        return { ...event.toObject(), registrationsCount: count };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/events", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/events/:id/registrations", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    const registrations = await Registration.find({
      event: req.params.id,
    }).populate("user", "name username");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/registrations", authenticate, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ error: "Admins cannot register for events." });
    }
    const { eventId } = req.body;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const count = await Registration.countDocuments({ event: eventId });
    if (count >= event.capacity) {
      return res.status(400).json({ error: "Event is already at full capacity." });
    }

    const registration = new Registration({
      user: req.user.id,
      event: eventId,
    });
    await registration.save();
    res.status(201).json(registration);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "You are already registered for this event." });
    }
    res.status(500).json({ error: error.message });
  }
});

router.get("/registrations/me", authenticate, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ error: "Forbidden: Students only" });
    }
    const registrations = await Registration.find({
      user: req.user.id,
    }).populate("event");
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
