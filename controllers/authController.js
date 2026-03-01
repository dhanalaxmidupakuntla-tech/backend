const supabase = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ email, password: hashedPassword }])
      .select()
      .single();

    if (error) return res.status(400).json({ error });

    // 🔥 Create profile
    await supabase.from("profiles").insert({
      id: data.id,
      xp: 0,
      achievements: []
    });

    res.json({ message: "User Registered Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json(error);

  res.json(data);
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data)
      return res.status(400).json({ message: "Invalid Credentials" });

    const valid = await bcrypt.compare(password, data.password);

    if (!valid)
      return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      {
        id: data.id,
        email: data.email,
        role: data.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: data.id,
        email: data.email,
        level: data.level,
        xp: data.xp,
        total_xp: data.total_xp,
        streak: data.streak,
        role: data.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id,email,level,xp,total_xp,streak,role")
      .eq("id", req.user.id)
      .single();

    if (error) return res.status(400).json(error);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateXp = async (req, res) => {
  try {
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const { xp } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { data, error } = await supabase
      .from("users")
      .update({ xp })
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) {
      console.log("Supabase error:", error);
      return res.status(400).json(error);
    }

    res.json({ message: "XP updated", data });
  } catch (err) {
    console.log("Server crash:", err);
    res.status(500).json({ message: "Server error" });
  }
};