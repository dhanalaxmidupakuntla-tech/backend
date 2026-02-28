const express = require("express");
const router = express.Router();
const supabase = require("../config/supabaseClient");

router.get("/", async (req, res) => {
  const { data } = await supabase
    .from("leaderboard")
    .select("*");

  res.json(data);
});

module.exports = router;