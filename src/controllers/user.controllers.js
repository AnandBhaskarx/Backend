import {asyncHandler} from '../utitls/asyncHandler.js'

const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:"yeahh..everything is running.."
    })
})

export {registerUser}