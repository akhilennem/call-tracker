const officerSchema = require('../models/officer')
const Redis = require("ioredis");
const redis = new Redis();

exports.addOfficer = async (req, res) => {
  try {
    console.log('create officer');

    const data ={ name, contact, region } = req.body;

    if (!name || !contact || !region ) {
      console.log('inside if');
      return res.status(400).json({ message: 'name,contact and region is required...' });
    }

    console.log('inside else');

    const newOfficer = new officerSchema(data);
    console.log('officerSchema:', newOfficer);

    const response = await newOfficer.save();
    console.log('response =>', response);

    if (response) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'New officer saved successfully', data: response });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

exports.editOfficer = async (req, res) => {
  try {
    const data = req.body;
    const id = req.query.id;
    console.log(data,id)
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await officerSchema.findOneAndUpdate({_id:id},{...data},{new:true})

    if (response) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Officer updated successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No officer record found with ID- ${id}` });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.deleteOfficer = async (req, res) => {
  try {
    console.log('delete officer');

    const id = req.query.id;
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await officerSchema.deleteOne({_id:id})
    console.log(response)

    if (response.deletedCount === 1) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Officer deleted successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No officer record found with ID- ${id}` });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getOfficerHistory = async (req, res) => {
  try {
    console.log('find Call');

    const {id,skip,limit} = req.query;
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }

    
    const key = `id:${id}:start:${skip}:end:${limit}`;
    let response;
    const cached = await redis.get(key);
    if (cached) {
      response = JSON.parse(cached)
      return res.json({success:true,message:"Successfully fetched officer call history from cache",data:response})
    }

const pipeline = [
  {
    $match: { _id: id }  
  },
{
    $lookup: {
      from: "calls",
      let: { officerId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$officerID", "$$officerId"] } } },      
        { $skip: parseInt(skip) },                        
        { $limit: parseInt(limit) }                       
      ],
      as: "callData"
    }
  },
  {
    $project: {
      officerName: "$name",
      contact: 1,
      callData: 1 
    }
  }
];

    response =await officerSchema.aggregate(pipeline)
    console.log(response)

    if (response.length>0) {
      await redis.set(key, JSON.stringify(response), "EX", 60*60);
      return res.status(200).json({ success:true,message: 'Officer history fetched successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No history record found with ID- ${id}` });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};