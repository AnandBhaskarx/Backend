import {asyncHandler} from '../utitls/asyncHandler.js'
import {ApiError} from '../utitls/ApiError.js'
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utitls/cloudinary.js"
import {ApiResponse} from '../utitls/ApiResponse.js'

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
        const avatarLocalPath = req.files?.avatar[0]?.path;
        // const coverImagelocalPath = req.files?.coverImage[0]?.path;
        
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

export {registerUser}