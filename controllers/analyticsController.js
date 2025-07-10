const Call = require('../models/callLogs');
const Officer = require('../models/officer');
const moment = require('moment');
const Redis = require("ioredis");
const redis = new Redis();


exports.OfficerDailyCallVolume = async (req,res) => {
    
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const id= req.query.id;
    const key = `id:${id}:start:${startOfDay}:end:${endOfDay}`;
    let response;
    const cached = await redis.get(key);
    if (cached) {
      response = JSON.parse(cached)
      return res.json({success:true,message:"Successfully fetched daily call volume of the officer from cache",data:response})
    }

    response = await Officer.aggregate([
    {
      $match:{
        _id:id,
      }
    },{
        $lookup:{
            from:"calls",
            let:{ officerId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$officerID", "$$officerId"] },
              createdAt: { $gte: startOfDay, $lte: endOfDay },  } },
            ],
            as: "callData",
        }
    },
    {
    $addFields: {
      callCount: { $size: "$callData" },
      totalDuration:{$sum:"$callData.callDuration"}
    }
    },
    { 
        $sort:{createdAt:-1} 
    },
    {
        $project:{
            name:1,
            contact:1,
            status:1,
            region:1,
            date:"$createdAt",
            callCount: 1,
            callData:1,
            totalCallTime:"$totalDuration"

        }
    }

  ]);

  if(response.length>0){
    await redis.set(key, JSON.stringify(response), "EX", 60*60);
  }

  return res.json({success:true,message:"Successfully fetched daily call volume of the officer",data:response})
};


exports.OfficerMonthlyCallVolume = async (req,res) => {
    
    const startOfDay = moment().startOf('month').toDate();
    const endOfDay = moment().endOf('month').toDate();
    const id= req.query.id;
    const key = `id:${id}:start:${startOfDay}:end:${endOfDay}`;
    let response;

    const cached = await redis.get(key);
    if (cached) {
      response = JSON.parse(cached)
      return res.json({success:true,message:"Successfully fetched daily call volume of the officer from cache",data:response})
    }

     response = await Officer.aggregate([
    {
      $match:{
        _id:id,
      }
    },{
        $lookup:{
            from:"calls",
            let:{ officerId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$officerID", "$$officerId"] },
              createdAt: { $gte: startOfDay, $lte: endOfDay },  } },
            ],
            as: "callData",
        }
    },
    {
    $addFields: {
      callCount: { $size: "$callData" },
      totalDuration:{$sum:"$callData.callDuration"}
    }
    },
    { 
        $sort:{createdAt:-1} 
    },
    {
        $project:{
            name:1,
            contact:1,
            date:{
                $dateToString: {
                    format: "%m-%Y",  
                    date: "$createdAt"
                }},
            callCount: 1,
            status:1,
            region:1,
            callData:1,
            totalCallTime:"$totalDuration"
        }
    }

  ]);

 if(response.length>0){
    await redis.set(key, JSON.stringify(response), "EX", 60*60);
  }
  
  return res.json({success:true,message:"Successfully fetched monthly call volume of the officer",data:response})
};

exports.getTaskOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = moment(startDate).startOf('day').toDate();
    const end = moment(endDate).endOf('day').toDate();

    const result = await Call.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $lookup:{
            from:"officers",
            localField:"officerID",
            foreignField:"_id",
            as:"officerData"
        }
      },
      {
        $unwind:"$officerData"
      },
      {
        $group: {
          _id: {
            officer: "$officerID",
            // officerName:"$officerData.name",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          officerName: { $first: "$officerData.name" },          
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.officer",
          name: { $first: "$officerName" },
            calls: {
            $push: {
              date: "$_id.date",
              count: "$count"
            }
          }
        }
      }
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error getting task overview:", error);
    res.status(500).json({ error: "Server Error" });
  }
};