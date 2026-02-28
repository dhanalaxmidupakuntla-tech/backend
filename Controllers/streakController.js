const supabase = require("../config/supabaseClient");

exports.updateStreak = async (req, res) => {
  const userId = req.user.id;
  const today = new Date().toISOString().split("T")[0];

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  let streak = user.streak;

  if (user.last_active === today) {
    return res.json({ streak });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (user.last_active === yesterdayStr) {
    streak += 1;
  } else {
    streak = 1;
  }

  await supabase
    .from("users")
    .update({ streak, last_active: today })
    .eq("id", userId);

  res.json({ streak });
};