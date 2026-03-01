const supabase = require("../config/supabaseClient");
const { calculateLevel } = require("./levelService");

async function addXP(userId, amount) {
  // 1️⃣ Get current user
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  // 2️⃣ Calculate new XP
  const newXP = user.xp + amount;
  const newTotalXP = user.total_xp + amount;

  // 3️⃣ Calculate level
  const newLevel = calculateLevel(newTotalXP);

  // 4️⃣ Update user
  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({
      xp: newXP,
      total_xp: newTotalXP,
      level: newLevel
    })
    .eq("id", userId)
    .select()
    .single();

  if (updateError) throw updateError;

  return {
    xp: updatedUser.xp,
    totalXP: updatedUser.total_xp,
    level: updatedUser.level
  };
}

module.exports = { addXP };