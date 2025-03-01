import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    try {
        const {token} = req.headers; // Use lowercase header key
        // console.log(token)
        if(!token){
          return  res.json({success:false,message:"Not Authorized ,Login again!"})
        }
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET )
        // console.log(tokenDecode)
        req.body.userId = tokenDecode.id
        next()
      } catch (error) {
      //  console.log(error)
        res.json({success:false,message:error.message})
      }
};

export default authUser;
