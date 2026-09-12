export function checkRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "forbidden" });
    }

    next();
  };
}

export function checkPageRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.redirect("/login.html");
    }

    if (!roles.includes(req.user.role)) {
      return res.redirect("/login.html");
    }

    next();
  };
}
