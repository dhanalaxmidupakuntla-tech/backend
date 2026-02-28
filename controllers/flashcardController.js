const supabase = require("../config/supabaseClient");

exports.getFlashcards = async (req, res) => {
  const userId = req.user.id;

  const { data: user } = await supabase
    .from("users")
    .select("level")
    .eq("id", userId)
    .single();

  const { data } = await supabase
    .from("flashcards")
    .select("*")
    .lte("level", user.level);

  res.json(data);
};

exports.submitAnswer = async (req, res) => {
  const userId = req.user.id;
  const { flashcardId, correct } = req.body;

  const { data } = await supabase
    .from("user_flashcards")
    .select("*")
    .eq("user_id", userId)
    .eq("flashcard_id", flashcardId)
    .single();

  let nextReview = new Date();

  if (correct) {
    nextReview.setDate(nextReview.getDate() + 3);
  } else {
    nextReview.setDate(nextReview.getDate() + 1);
  }

  await supabase.from("user_flashcards").upsert([
    {
      user_id: userId,
      flashcard_id: flashcardId,
      correct_count: correct ? 1 : 0,
      wrong_count: correct ? 0 : 1,
      next_review: nextReview
    }
  ]);

  res.json({ message: "Answer Saved" });
};