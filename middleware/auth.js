const auth = (req, res, next) => {
    const { secretKey, apiKey } = req.headers;
  
    console.log(req.headers['secretKey']);
    if (req.headers['secretKey'] == process.env.SECRET_KEY && req.headers['apiKey'] == process.env.API_KEY) {
      next(); // Continue with the request
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  };

  module.exports = auth;