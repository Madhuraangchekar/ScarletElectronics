
const generateOTP = async()=>{
    try{

        const otp = Math.floor(10000+ Math.random()*90000)+"";
        return otp;
    }
    catch(err)
    {
        console.log(err);
        throw err;
    }
}

module.exports = generateOTP;