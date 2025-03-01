import jwt from "jsonwebtoken"
const authDoctor = (req,res,next) =>{
  try {
    const {dtoken} = req.headers; // Use lowercase header key
    // console.log(token)
    if(!dtoken){
      return  res.json({success:false,message:"Not Authorized ,Login again!"})
    }
    const tokenDecode = jwt.verify(dtoken,process.env.JWT_SECRET )
    // console.log(tokenDecode)
    req.body.doctorId = tokenDecode.id
    next()
  } catch (error) {
 //   console.log(error)
    res.json({success:false,message:error.message})
  }
}
export default authDoctor