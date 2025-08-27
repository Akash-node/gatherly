const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userModel = require("../models/user.model")


//--------------Registration-----------------------

const userRegistration = async (req,res) => {

    const role = "user";
    const {name,email,password} = req.body;
    
    if (
        [name,email,password].some(
          (field) => field?.trim() === ""
        )
      ) {
        res.status(400)
        throw new Error("All field are required")
      }

      const emailAlreadyExist = await userModel.findOne({email});

      if(emailAlreadyExist){
        res.status(400)
        throw new Error("Email already exist")
      }

      const hashedPassword = await bcrypt.hash(password,10);
    
      const user = await userModel.create({
        name,
        email,
        password : hashedPassword,
        role
      })

      const userCreated = await userModel.findById(user._id).select("-password")

      if(!userCreated){
        res.status(404).json({
            "message" : "Something went wrong while creating a user"
        })
      }

      return res.status(201).json({
        "message" : "user created successfully",
        userCreated
      }
      )

}

//--------------Login-----------------------

const userLogin = async (req,res) =>{
    const {email,password} = req.body;

    if (
        [email,password].some(
          (field) => field?.trim() === ""
        )
      ) {
        res.status(400)
        throw new Error("All field are required")
      }

      const validUser = await userModel.findOne({email})
      if(!validUser){
        res.status(404)
        throw new Error("User not found")
      }


      const isPasswordValid = await bcrypt.compare(password,validUser.password)

      if(!isPasswordValid){
         res.status(402)
         throw new Error("Invalid Credential")
      }

      const user = await userModel.findById(validUser._id).select("-password")

      const JwtToken = jwt.sign(
        {
            id: user._id,   
            name : user.name,   
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
      )

      res.cookie("JwtToken",JwtToken,{
        httpOnly: false,
        secure: false,
        sameSite : "lax",
        maxAge: 7*24*60*60*1000
})

      return res.status(200).json({
        user,
        JwtToken,
        "message" : "login successfully",      
})
}


//--------------Logout-----------------------

const userLogout = (req, res) => {
  res.clearCookie("JwtToken", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURITY
  });

  return res.status(200).json({ message: "Logged out successfully" });
};


//--------------Update User-----------------------

const updateUser = async (req,res) => {
  const {name,email} = req.body;
   if ([name,email].some((field) => field?.trim() === "")) {
    throw new Error("All field are required");
   }
    const emailAlreadyExist = await userModel.findOne({ email });
    if (emailAlreadyExist) {
      throw new Error("Email is already taken");
    }else{
      await userModel.findByIdAndUpdate(req.user._id,
        {
        name,
        email
      });
    }
     res
     .json({"message" : "User updated successfully!!!"})
     .status(200)
} 

//--------------Change Password-----------------------

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const currentUser = await userModel.findOne({email : req.user.email})
   

    // Compare old password with the hashed password from DB
    const isMatch = await bcrypt.compare(oldPassword, currentUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await userModel.findByIdAndUpdate(req.user._id, {
      $set: { password: hashedPassword },
    });

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("Error in changePassword:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {userRegistration,userLogin,userLogout,updateUser,changePassword};