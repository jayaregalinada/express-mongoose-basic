export default function cors(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');

  next();
}