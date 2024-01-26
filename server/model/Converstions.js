const mongoose=require("mongoose")
const {Schema} =mongoose;
const CoversationsAchma= new Schema({
    members:{
        type:Array,
        required:true
    }
})

exports.Conversations=mongoose.model("Conversations",CoversationsAchma);