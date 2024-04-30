import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
//jwt ek bearer token h (jo usko bear krta voh sahi maan lete h hum)
import bcrypt from "bcrypt"
const userSchema =new Schema(
    {
        username:{
            type :String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true

        },
        email:{
            type :String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true

        },
        fullName:{
            type :String,
            required:true,
            
            lowercase:true,
            trim:true,
            index:true

        },
        avatar:{
            type:String,
            required:true,

        },
        coverImage:{
            type:String
        },
        watchHistory:[{
            type:Schema.Types.ObjectId,
            ref:"Video"


        }],
        password:{
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }


    },{timestamps:true}
)
//pre hook of mongoose
//user ke data ke run hone se just pehle agr hume kuch execute krna h toh hum iss hook ki help se kra skte h

userSchema.pre("save",async function(next){
    //idhar hum log callback mein function() use kr rhe h instead of ()=>{} kyuki arrow func mein hum this use nhi kr skte
    if (!this.isModified("password")) return next();
    //^ iska mtlb h agr password modifie nhi hua h  toh direct next ko call krdo 

    this.password= await bcrypt.hash(this.password,10)
    next()
})


//now creating a custom method to check if pwd entered by the user is matching the passwords in database or not
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

//custom method to generate access token
userSchema.methods.generateAccessToken= function(){
    //jwt has sign method joki generate kr deta h token
   return  jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.useraname,
        fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
   return  jwt.sign({
    _id:this._id,
   
   },process.env.REFRESH_TOKEN_SECRET,
   {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   }
)
}

export const User = mongoose.model("User",userSchema)