const { addXP } = require("../services/xpService");

router.post("/complete", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const updatedUser = await addXP(userId, 10);

    res.json({
      message: "XP added",
      xp: updatedUser.xp,
      totalXP: updatedUser.total_xp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});