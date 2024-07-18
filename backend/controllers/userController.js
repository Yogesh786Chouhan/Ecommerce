const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

// Register a user
exports.registerUser = catchAsyncErrors(
    async (req, res, next) => {

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        const { name, email, password } = req.body;
        const user = await User.create({
            name, email, password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        });
        sendToken(user, 201, res);
    });

//Login User
exports.loginUser = catchAsyncErrors(
    async (req, res, next) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (user == null) {
            return next(new ErrorHandler("Please Enter Correct Email & Password", 400));
        }
        else {
            bcrypt.compare(req.body.password, user.password, async (error, result) => {
                if (result) {
                    // token 
                    let token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
                    if (token) {
                        sendToken(user, 201, res);
                    }
                }
                else {
                    return next(new ErrorHandler("Invalid Email or Password", 401));
                }
            })
        }
    });

// Logout User
exports.logout = catchAsyncErrors(
    async (req, res, next) => {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    });

// Forgot Password
exports.forgotPassword = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // Get ResetPassword Token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

        try {
            await sendEmail({
                email: user.email,
                subject: `Ecommerce Password Recovery`,
                message,
            });

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}.successfully`,
            })


        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new ErrorHandler(error.message, 500));
        }
    });

//Reset Password
exports.resetPassword = catchAsyncErrors(
    async (req, res, next) => {
        // Creating token hash
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
        }

        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not match", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        sendToken(user, 200, res);
    });

// Get User Details
exports.getUserDetails = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    });

// Update User Password
exports.updatePassword = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.user.id).select("+password");
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);


        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler("password does not match", 400));
        }

        user.password = req.body.newPassword;

        await user.save();

        sendToken(user, 200, res);
    });

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {};

    // Add name to newUserData if provided
    if (req.body.name) {
        newUserData.name = req.body.name;
    }

    // Add email to newUserData if provided
    if (req.body.email) {
        newUserData.email = req.body.email;
    }

    // Update avatar if provided
    if (req.body.avatar && req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        // Check if user has an existing avatar
        if (user.avatar && user.avatar.public_id) {
            const imageId = user.avatar.public_id;
            await cloudinary.v2.uploader.destroy(imageId);
        }

        // Upload new avatar
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    // Ensure at least one field is being updated
    if (Object.keys(newUserData).length === 0) {
        return next(new ErrorHandler("Please provide data to update", 400));
    }

    // Update user data in the database
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, // Return the updated document
        runValidators: true, // Validate before update
        useFindAndModify: false // Use new MongoDB update method
    });

    res.status(200).json({
        success: true,
        user, // Optionally include updated user data in the response
    });
});

// Get All Users (admin)
exports.getAllUser = catchAsyncErrors(
    async (req, res, next) => {
        const users = await User.find();
        res.status(200).json({
            success: true,
            users,
        });
    });

// Get Single User (admin)
exports.getSingleUser = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findById(req.params.id);
        // console.log(user)
        if (!user) {
            return next(new ErrorHandler(`User does not exist with Id:${req.params.id}`));
        }

        res.status(200).json({
            success: true,
            user,
        });
    });

// Update User role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    // We will add cloudinary later

    if (!req.body.name || !req.body.email || !req.body.role) {
        return next(new ErrorHandler("please enter field", 400));
    }
    else {
        const user = await User.findByIdAndUpdate(req.params.id, newUserData);
    }

    res.status(200).json({
        success: true,
    });
});

// Delete User -- Admin
exports.deleteUser = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new ErrorHandler(`User does not exist Id:${req.params.id}`));
        }

        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",

        });
    });
