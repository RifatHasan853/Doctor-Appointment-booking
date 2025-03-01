import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
    const { atoken } = req.headers;
    
    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized, Login again!" });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Not Authorized, Login again!" });
    }

    next();
  } catch (error) {
   // console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
