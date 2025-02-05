const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecreat="mynameisvinod"

const registerUser = async (req,res) => {
    try {
        const {user_name,email,password} = req.body;
        //to make secure password in database
        const salt = await bcrypt.genSalt(10);
        let secPassword=await bcrypt.hashSync(password,salt);

        const newuser = await User.create({
            user_name,
            email,
            password : secPassword
        })

        return res.status(200).json({success:true,message:"user registered succesfully",data:newuser})
        
    } catch (error) {
        return res.status(400).json(err)
    }
}
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let userdata = await User.findOne({ email });
        if (!userdata) {
            return res.status(400).json({ errors: "Try login with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, userdata.password);
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Try login with correct credentials" });
        }

        const data = {
            user: {
                id: userdata.id,
                email: userdata.email,
                user_name: userdata.user_name
            }
        };

        const authToken = jwt.sign(data, jwtSecreat);
        return res.json({ success: true, authToken });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports ={registerUser,loginUser}

