const asyncHandler = (requestHandler) =>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=>next(err))
    }
}

export {asyncHandler}



//ese try catch se bhi hota he
// const asyncHandler = (fn)=> async(req,res,next) => {
//     try{
//             await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false ,
//             message:err.message
//         })
//     }
// }