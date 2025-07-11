import {asyncHandler} from '../utitls/asyncHandler.js'
import {ApiError} from '../utitls/ApiError.js'
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utitls/cloudinary.js"
import {ApiResponse} from '../utitls/ApiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false })

        return {accessToken,refreshToken}
    }catch (error){
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}


const registerUser = asyncHandler(async (req,res)=>{
        //get user details from frontend
        //validation - not empty
        //check if user alredy exist: username,email
        //check for images, check for avatars
        //upload them to cloudinary, avatar
        //create user object - create entry in db
        //remove password and refresh tookenn field from response
        //check for user creation 
        //return response

        const {fullname,email,username,password}=req.body
        console.log("email",email);

        if(
            [fullname,email,username,password].some((field)=>
            field?.trim()===""
            )
        ){
            throw new ApiError(400,"All fields are required")
        }

        const existedUser= await User.findOne({
            $or:[{ username },{ email }]
        })
        if(existedUser){
            throw new ApiError(409, "User with email or username alredu exist")
        }
        // console.log(req.files)
        let avatarLocalPath = req.files?.avatar[0]?.path;
        // const coverImagelocalPath = req.files?.coverImage[0]?.path;
        
        // let avatarLocalPath;
        if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
            avatarLocalPath = req.files.avatar[0].path;
        }
         else {
            throw new ApiError(400, "Avatar file is required");
        }


        let coverImagelocalPath;
        if (req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage .length>0){
            coverImagelocalPath = req.files.coverImage[0]?.path
                    }
        if(!avatarLocalPath){
                throw new ApiError(400,"Avatar file is required")
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImagelocalPath)

        if(!avatar){
        throw new ApiError(400,"Avatar file is required")
        }

        const user = await User.create({
            fullname,
            avatar:avatar.url,
            coverImage:coverImage?.url || "",
            email,
            password,
            username
        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registring the user")
        }

        return res.status(201).json(
            new ApiResponse(200,createdUser, "User registered succsully !!")
        )

})

const loginUser = asyncHandler(async(req,res)=>{
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and reresh token
    //send cookie

    const {email,username,password} = req.body

    // if(!username || !email) //wrong way
        
      if(!(username || email)){
            throw new ApiError(400,"username or email is required")
    }
    
    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User no exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser =await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse (
            200,
            {
                user:loggedInUser , accessToken ,refreshToken
            },
            "User logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 

   if(incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
   }

try {
       const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
       )
    
       const user = await User.findById(decodedToken?._id)
    
       if(!user){
        throw new ApiError(401," invalid refresh token")
       }
    
       if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401," refresh token is expired or used ")
       }
    
       const options ={
        httpOnly:true,
        secure:true
       }
    
       const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
    
       return res
       .status(200)
       .cookie("accessToken",accessToken,options)
       .cookie("refreshToken",newrefreshToken,options)
       .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "Access token refreshed"
            )
       )
} catch (error) {
        throw new ApiError(401, error?.message || 
            "Invalid refresh token"
        )
}
})

export {registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken
}