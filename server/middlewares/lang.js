export default function (req, res, next) {
  res.locals.lang = 'en';
  req.lang = 'en';
  next();
}
