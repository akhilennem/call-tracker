const CallLogSchema = require('../models/callLogs')
const mongoose = require('mongoose')

// exports.LogCall = async (req, res) => {
//   try {
//     console.log('logCall');

//     const data ={ officerID, clientID, callType, callOutcome, comment, callDuration } = req.body;

//     if (!officerID || !clientID || !callType || !callOutcome || !callDuration) {
//       console.log('inside if');
//       return res.status(400).json({ message: 'Some fields are missing...' });
//     }

//     console.log('inside else');


//     const newCallLog = new CallLogSchema(data);
//     console.log('CallLog:', newCallLog);

//     const response = await newCallLog.save();
//     console.log('response =>', response);

//     if (response) {
//       console.log('inside success block');
//       return res.status(200).json({ success:true,message: 'Call logged successfully', data: response });
//     }
//   } catch (error) {
//     console.error('Error in LogCall:', error);
//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

exports.editLog = async (req, res) => {
  try {
    console.log('edit Call');

    const data = req.body;
    const id = req.query.id;
    console.log(data,id)
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await CallLogSchema.findOneAndUpdate({_id:id},{...data})

    if (response) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Call log updated successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No call record found with ID- ${id}` });

  } catch (error) {
    console.error('Error in LogCall:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.deleteLog = async (req, res) => {
  try {
    console.log('delete Call');

    const id = req.query.id;
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await CallLogSchema.deleteOne({_id:id})
    console.log(response)

    if (response.deletedCount === 1) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Call log deleted successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No call record found with ID- ${id}` });

  } catch (error) {
    console.error('Error in LogCall:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.findLogByID = async (req, res) => {
  try {
    console.log('find Call');
    
    const indexes = await CallLogSchema.collection.listIndexes().toArray();
    console.log(indexes);
      
    const id = req.query.id;
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await CallLogSchema.findOne({_id:id})
    console.log(response)

    if (response) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Call log fetched successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No call record found with ID- ${id}` });

  } catch (error) {
    console.error('Error in LogCall:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


