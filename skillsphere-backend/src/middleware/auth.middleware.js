const passport = require('passport');

const protect = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = { protect };
