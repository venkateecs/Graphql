
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (args)=>{
      try {
        let userCheck = await User.findOne({email: args.userInput.email});
          if (userCheck) {
            throw new Error('User Already Exist');
          } else {
            let hashedPassword = await bcrypt.hash(args.userInput.password,12) ;          
            const user = new User({
              email : args.userInput.email,
              password : hashedPassword,
            })
            let result = await user.save();
            return {...result._doc ,password:null, _id: result.id}
          }
        } catch(err) {
          throw new Error(err);
        }    
    },
    login: async({email, password})=> {
      const user = await User.findOne({email: email});
      if (!user) {
        throw new Error('User doesnt exists!');
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error('Password is not correct!');
      }
      const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey',{expiresIn:'1h'});
      return {
        userId:user.id,
        token: token,
        tokenExpiration: 1
      }
    }
  }