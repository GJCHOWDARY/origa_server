const bcrypt = require("bcryptjs"),
  fs = require('fs'),
  path = require('path'),
  User = require("../models/user"),
  environment = require('../config/environment'),
  validator = require('validator'),
  config = environment.config();

exports.createUser = async (req, res, next) => {
  try {
    const findUser = await User.findOne({ email: req.body.email })
    if (!findUser) {
      const newUser = new User({
        email: req.body.email,
        status: 'Active',
        name: req.body.name,
      });
      let saveUser = await newUser.save()
      if (saveUser) {
        res.status(201).json({
          message: "User created!",
          status: true
        });
      }
    } else {
      res.status(403).json({
        message: "User Already Exists!",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const search = req.query.search;
  var where = {};
  if (search) {
    where.name = { $regex: search, $options: 'i' }
  }
  let postQuery = User.find(where)                     
  if (pageSize && currentPage) {
    postQuery.select('_id email name status createdAt').skip(pageSize * (currentPage - 1)).limit(pageSize).sort({ createdAt: 'desc' }).exec;
  }
  postQuery.then(documents => {
    fetchedUsers = documents;
    return User.countDocuments(where);
  })
    .then(count => {
      res.status(200).json({
        message: "Users Fetched successfully!",
        users: fetchedUsers,
        userCount: count
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = "Fetching Failed!"
      }
      next(err);
    });
}

exports.getUser = (req, res, next) => {
  const postQuery = User.find({ _id: req.params.id })
    .select('_id email name no_of_orders status createdAt')
    .then(userdoc => {
      if (userdoc.length > 0) {
        res.status(200).json({
          message: "Users Fetched successfully!",
          user: userdoc
        })
      } else {
        res.status(404).json({
          message: "User Not Found!"
        })
      }
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
        error.message = "Fetching Failed!"
      }
      next(error);
    });
}

exports.searchUsers =async (req, res, next) => {
  try{
    const search = req.query.search;
    var where={};  
      if (search) {
        where.name={ $regex: search, $options: 'i' }
        where.status='Active';
      let postQuery=await User.find(where).select('_id email name').limit(10);
        if(postQuery){
            res.status(200).json({
              message: "Fetched successfully!",
              users: postQuery,
            });
        }
      } else{
        res.status(200).json({
          message: "Users Fetched successfully!",
          users: 0,
        });
      }
   } catch(err) {
     console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500;
      err.message= "Fetching Failed!"
    }
    next(err);  
  }
}

exports.userAverageOrders = async (req, res, next) => { 
  let data=await User.aggregate([ 
    { 
      $lookup:{
        from:"orders", 
        localField:"_id",
        foreignField:"userId",
        as:"order"
     }
   },
    {
      $addFields:{
      averageBillValue:{
        $sum:"$order.sub_total"
      }
    }
  }
  ]);

  if(data){
    res.status(200).json({status:true, data});
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    var userData = {
      _id: req.body.id,
      email: req.body.email,
      name: req.body.name, 
      no_of_orders: req.body.no_of_orders,
    };
    let updateUser = await User.updateOne({ _id: req.params.id }, userData)
    if (updateUser) {
      res.status(200).json({ message: "Update successful!", status: true });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


var updateAllUsers = function(users, callback) { 
      Promise.all(
        users.map((user) => {
           return new Promise(function(resolve,reject) {
            User.updateOne({_id: user._id},{_id:user._id,no_of_orders: Math.floor(Math.random() * 10) + 1 })
            .then(count => {
            resolve('done'); 
            })
        })
      })
    )
    .then((done) => { 
      callback(null,'done!')
    })
    .catch((err) => {
      console.log('errrrr',err)
      callback(err,'Error while writing the CSV file!')
   });             
}


exports.randomUpdateUser = async (req, res, next) => {
  try { 
    // let update = await User.updateMany({ $set: { no_of_orders: Math.floor(Math.random() * 10) + 1 } })
    let findall= await User.find({})
      if(findall){
        updateAllUsers(findall, function(err, done) { 
          if(err){
            res.status(400).json({ message: "Failed to Update!", status: false });
          }
          res.status(200).json({ message: "Update successful!", status: true });
      })
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    var deleteUser = await User.deleteOne({ _id: req.params.id })
    res.status(200).json({ message: "Deletion successful!" });
  } catch (error) {
    res.status(500).json({
      message: "Deleting failed!"
    });
  };
};
