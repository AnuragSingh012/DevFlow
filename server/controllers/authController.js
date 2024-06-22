import User from "../mongodb/models/user.js";

export const registerUser = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    const user = new User({ name, username, email });
    const registeredUser = await User.register(user, password); // Register user with hashed password

    // Automatically log in the user after registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(201).json(registeredUser);
    });
  } catch (err) {
    if (err.name === 'UserExistsError') {
      res.status(400).json({ message: 'Username already taken' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

export const loginUser = (req, res) => {
  // If authentication is successful, user information is stored in req.user
  res.status(200).json(req.user);
};

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful" });
  });
};
