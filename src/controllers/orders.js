const bcrypt = require("bcryptjs"),
    fs = require('fs'),
    path = require('path'),
    Order = require("../models/orders"),
    User = require("../models/user"),
    environment = require('../config/environment'),
    validator = require('validator'),
    config = environment.config();

exports.createOrder = async (req, res, next) => {
    try {
        const newOrder = new Order({
            sub_total: req.body.sub_total,
            userId: req.body.userId,
        });
        let saveUser = await newOrder.save()
        if (saveUser) {
            let findUser = await User.findOne({_id: req.body.userId})
            if (findUser) {
                findUser.no_of_orders += 1;
                let updateUser = await findUser.save();
                if (updateUser) {
                    res.status(201).json({
                        message: "created!",
                        status: true
                    });
                }
            } else {
                res.status(403).json({
                    message: "Something went Wrong!",
                    status: true
                });
            }
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getOrders = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const search = req.query.search;
    var where = {};
    let fetchedOrders;

    let postQuery = Order.find(where).populate('userId', 'email name no_of_orders')
    if (pageSize && currentPage) {
        postQuery.select('_id sub_total userId status order_date createdAt')
            .skip(pageSize * (currentPage - 1)).limit(pageSize).sort({ createdAt: 'desc' }).exec;
    }
    postQuery.then(documents => {
        fetchedOrders = documents;
        return Order.countDocuments(where);
    })
        .then(count => {
            res.status(200).json({
                message: "Fetched successfully!",
                orders: fetchedOrders,
                count: count
            });
        })
        .catch(err => {
            console.log(err)
            if (!err.statusCode) {
                err.statusCode = 500;
                err.message = "Fetching Failed!"
            }
            next(err);
        });
}

exports.getOrderById = (req, res, next) => {
    const getQuery = Order.find({ _id: req.params.id })
        .populate('userId', 'email name no_of_orders')
        .select('_id sub_total userId order_date status createdAt')
        .then(doc => {
            if (doc.length > 0) {
                res.status(200).json({
                    message: "Fetched successfully!",
                    order: doc
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

exports.updateOrder = async (req, res, next) => {
    try {
        var orderData = {
            _id: req.body.id,
            sub_total: req.body.sub_total,
            userId: req.body.userId,
        };
        let updateOrder = await Order.updateOne({ _id: req.params.id }, orderData)
        if (updateOrder) {
            res.status(200).json({ message: "Successfully Updated!", status: true });
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.deleteOrder = async (req, res, next) => {
    try {
        var deleteUser = await Order.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: "Deleted Successfully!" });
    } catch (error) {
        res.status(500).json({
            message: "Deleting failed!"
        });
    };
};
