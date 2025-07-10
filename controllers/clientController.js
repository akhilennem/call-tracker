const ClientSchema = require('../models/client')
const Redis = require("ioredis");
const redis = new Redis();

exports.addClient = async (req, res) => {
  try {
    console.log('create officer');

    const data ={ name, contact, region } = req.body;

    if (!name || !contact || !region ) {
      console.log('inside if');
      return res.status(400).json({ message: 'name,contact and region is required...' });
    }

    console.log('inside else');

    const newClient = new ClientSchema(data);
    console.log('ClientSchema:', newClient);

    const response = await newClient.save();
    console.log('response =>', response);

    if (response) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'New client saved successfully', data: response });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.editClient = async (req, res) => {
  try {
    console.log('edit Call');

    const data = req.body;
    const id = req.query.id;
    console.log(data,id)
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await ClientSchema.findOneAndUpdate({_id:id},{...data},{new:true})

    if (response) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Client updated successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No client record found with ID- ${id}` });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    console.log('delete officer');

    const id = req.query.id;
    if(!id){
        return res.status(200).json({success:false,message:'Id is required'})
    }
    const response =await ClientSchema.deleteOne({_id:id})
    console.log(response)

    if (response.deletedCount === 1) {
      console.log('inside success block');
      return res.status(200).json({ success:true,message: 'Client deleted successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No client record found with ID- ${id}` });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getClientHistory = async (req, res) => {
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
      return res.json({success:true,message:"Successfully fetched client call history from cache",data:response})
    }

const pipeline = [
  {
    $match: { _id: id }  
  },
{
    $lookup: {
      from: "calls",
      let: { clienId: "$_id" },
      pipeline: [
        { $match: { $expr: { $eq: ["$clientID", "$$clienId"] } } },      
        { $skip: parseInt(skip) },                        
        { $limit: parseInt(limit) }                       
      ],
      as: "callData"
    }
  },
  {
    $project: {
      clientName: "$name",
      contact: 1,
      callData: 1 
    }
  }
];

     response =await ClientSchema.aggregate(pipeline)

    if (response.length>0) {

      await redis.set(key, JSON.stringify(response), "EX", 60*60);
      return res.status(200).json({ success:true,message: 'Client history fetched successfully', data: response });
    }else
          return res.status(200).json({ success:false, message: `No history record found with ID- ${id}` });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};