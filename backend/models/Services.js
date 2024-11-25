const mongoose = require('mongoose');


// Service Schema
const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
});


// Package Schema
const PackageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    details:{type: String, required: true},
});


// Panel Schema
const PanelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    details:{type: String, required: true},},
    { collection: 'panel' });


// Export the models
const ServiceModel = mongoose.model('service', ServiceSchema);
const PackageModel = mongoose.model('package', PackageSchema);
const PanelModel = mongoose.model('panel', PanelSchema);


module.exports = { ServiceModel, PackageModel, PanelModel };
