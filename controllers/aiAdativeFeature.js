exports.getRecommendedLessons = async (req, res) => {
  const userId = req.user.id;

  const { data: user } = await supabase
    .from("users")
    .select("level, xp")
    .eq("id", userId)
    .single();

  let difficulty = user.level;

  if (user.xp < 30) difficulty -= 1;
  if (user.xp > 80) difficulty += 1;

  const { data } = await supabase
    .from("lessons")
    .select("*")
    .eq("level", difficulty);

  res.json(data);
};