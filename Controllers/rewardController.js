const supabase = require("../config/supabaseClient");

exports.dailyReward = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase.rpc("claim_daily_reward", {
    p_user_id: userId
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.json({
    message: "Daily reward claimed 🎁",
    xpGain: data[0].xp_gain,
    newXP: data[0].new_xp
  });
};