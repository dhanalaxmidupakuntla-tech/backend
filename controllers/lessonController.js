const supabase = require("../config/supabaseClient");

exports.getLessons = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("level")
      .eq("id", userId)
      .single();

    if (userError) return res.status(400).json(userError);

    const { data: lessons, error: lessonError } = await supabase
      .from("lessons")
      .select("*")
      .lte("level", user.level);

    if (lessonError) return res.status(400).json(lessonError);

    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({ message: "lessonId is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: lesson, error: lessonError } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    let xpGain = lesson.xp_reward + user.level * 2;
    let newXP = user.xp + xpGain;
    let newTotalXP = user.total_xp + xpGain;
    let newLevel = user.level;

    while (newXP >= 100) {
      newLevel += 1;
      newXP -= 100;
    }
    
    const { error: updateError } = await supabase
      .from("users")
      .update({
        xp: newXP,
        total_xp: newTotalXP,
        level: newLevel
      })
      .eq("id", userId);

    if (updateError) {
      return res.status(400).json(updateError);
    }

    res.json({
      message: "Lesson Completed 🎉",
      xpGain,
      newLevel
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getRecommendedLessons = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user } = await supabase
      .from("users")
      .select("level")
      .eq("id", userId)
      .single();

    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .lte("level", user.level);

    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};