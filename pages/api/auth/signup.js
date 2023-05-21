import bcryptjs from "bcryptjs";
import db from "../../../utils/db";
import User from "../../../models/User";

async function handler(req, res) {
  if (req.method !== "POST") {
    return;
  }

  const { name, email, password, image } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: "Os dados cadastrados são inválidos.",
    });
    return;
  }

  await db.connect();

  let newEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) {
    res.status(422).json({ message: "E-mail já cadastrado!" });
    await db.disconnect();
    return;
  }

  const newUser = new User({
    name,
    email: newEmail,
    password: bcryptjs.hashSync(password),
    image,
    isAdmin: false,
  });

  const user = await newUser.save();
  await db.disconnect();
  res.status(201).send({
    message: "Usuário criado com sucesso!",
    _id: user._id,
    name: user.name,
    image: user.image,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
