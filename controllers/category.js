const Category = require('../models/Category');
const Position = require('../models/Position');
const errorHandler = require('../utils/errorHandler');
const { update } = require('./position');

module.exports.getAll = async function(req, res) {
    try {
        const categories = await Category.find({user: req.user.id});
        res.status(200).json(categories);
    }
    catch(e) {
        errorHandler(res, e)
    }
}

module.exports.getById = async function(req, res) {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    }
    catch(e) {
        errorHandler(res, e)
    }
}

module.exports.remove = async function(req, res) {
    try {
        const categoryId = req.params.id
        await Category.findOneAndRemove({_id: categoryId}); 
        await Position.deleteMany({category: categoryId});  
        res.status(200).json({
            message: "Category and related positions have been deleted"
        });
    }
    catch(e) {
        errorHandler(res, e)
    }
}

module.exports.create = async function(req, res) {
    try {
        const category = await new Category({
            name: req.body.name,
            user: req.user.id,
            imageSrc: req.file ? req.file.path : ''
        }).save();

        res.status(201).json(category);
    }
    catch(e) {
        errorHandler(res, e)
    }
}

module.exports.update = async function(req, res) {
    const updated = {
        name: req.body.name
    };

    if (req.file) {
        updated.imageSrc = req.file.path;
    }
    try {
        const category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {$set: updated},
            {new: true}
        );
        res.status(200).json(category);
    }
    catch(e) {
        errorHandler(res, e)
    }
}