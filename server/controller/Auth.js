exports.checkAuth=async(req,res)=>{
   const success=true
   return res.status(200).send(req.user)
  }
  