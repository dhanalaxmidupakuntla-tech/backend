const supabase = require("../config/supabaseClient");

exports.dailyReward = async (req, res) => {
  const userId = req.user.id;

  const today = new Date().toISOString().split("T")[0];

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (user.last_active === today) {
    return res.status(400).json({ message: "Already claimed today" });
  }

  const xpGain = 10;

  const { error } = await supabase
    .from("users")
    .update({
      xp: user.xp + xpGain,
      total_xp: user.total_xp + xpGain,
      streak: user.last_active === null ? 1 : user.streak + 1,
      last_active: today,
    })
    .eq("id", userId);

  if (error) return res.status(400).json(error);

  res.json({
    message: "Daily reward claimed!",
    xpGain,
  });
};