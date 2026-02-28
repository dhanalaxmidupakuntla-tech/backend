const supabase = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ email, password: hashedPassword }])
    .select();

  if (error) return res.status(400).json({ error });

  res.json({ message: "User Registered Successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (!data) return res.status(400).json({ message: "Invalid Credentials" });

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) return res.status(400).json({ message: "Invalid Credentials" });

  const token = jwt.sign(
    { id: data.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user: data });
};

exports.getMe = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id,email,level,xp,total_xp,streak")
    .eq("id", req.user.id)
    .single();

  if (error) return res.status(400).json(error);

  res.json(data);
};