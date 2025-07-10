const mongoose = require("mongoose")
const { v4: uuid } = require('uuid');

const clientSchema = new mongoose.Schema ({

    _id:{
        type:String,
        default:uuid
    },
    name:
    {
        type:String
    },
    contact: 
    { 
        type: String
    },
    status:{
      type: String, 
      enum: ['active', 'inactive'],
      default:'active' 
    },
    region:{
        type:String
    }

},
    {
        timestamps:true
    }
)

module.exports=mongoose.model('client',clientSchema)