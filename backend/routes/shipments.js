var router = require('express').Router();
const { Op } = require("sequelize");
const db = require("../models"); // models path depend on your structure
const { DateTime } = require("luxon");
const Shipments = db.shipments;
var auth = require('./auth');
router.get('/monthly-shipments',auth.optional,function(req,res,next){
  var datetime = new Date();
  current_date = datetime.toISOString().slice(0,10);
  Shipments.findAll({
      where : 
      {
        shipmentStatus : 1,
        shipmentDate:{
          [Op.gte]: current_date,
        }
      },
      order: [
        ['shipmentDate', 'ASC']
      ]
    }).then(function(data){
      let new_data= {};
      let monthlyShipments = [];
      for (const [key, value] of Object.entries(data)) {
        shipmentDate = value.shipmentDate;
        isoDate = DateTime.fromISO(shipmentDate);
        formatedDate = isoDate.toFormat('MMMM yyyy')  
        if(formatedDate in new_data )
        {
          array_shipemnts = new_data[formatedDate];
          array_shipemnts.push(value);
          new_data[formatedDate] = array_shipemnts;
        }
        else
        {
          array_shipemnts = [value]
          new_data[formatedDate] = array_shipemnts;
        }
      }
      let final_data = {
        'monthly_shipments' : new_data,
        'all_shipments' : data
      }
      res.send(final_data);
  }).catch(next);
})
router.get('/schedule', auth.optional, function(req, res, next) {
  var datetime = new Date();
  current_date = datetime.toISOString().slice(0,10);
  Shipments.findAll({
      where : 
      {
        shipmentStatus : 1,
        shipmentDate:{
          [Op.gte]: current_date,
        }
      },
      order: [
        ['shipmentDate', 'ASC']
      ]
    }).then(function(data){
      res.send(data);
  }).catch(next);
});
router.delete('/bulk-delete',auth.required,function(req,res,next){
  delete_ids = req.body.ids;
  Shipments.destroy({
      where: {
        id: delete_ids
      }
    }).then(function(){
      res.send({'message' : "Shipments Deleted Successfully."})
    });
})
router.get('/', auth.required, function(req, res, next) {
  //var query = {};
  var limit = 20;
  var offset = 0;
  if(typeof req.query.limit !== 'undefined'){
    limit = parseInt(req.query.limit) || 20;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = parseInt(req.query.offset) || 0;
  }
  Shipments.findAndCountAll({ 
        order: [
          ['shipmentDate', "DESC"]
        ] , 
        offset: offset, 
        limit: limit
      }).then(function(data){
      res.send(data);
  }).catch(next);
});
router.get('/:id', auth.required, function(req, res, next) {
  Shipments.findByPk(req.params.id).then(function(data){
      res.send(data);
  }).catch(next);
});
router.put('/:id', auth.required, function(req, res, next) {
  Shipments.update({shipmentDate : req.body.shipment.shipmentDate,shipmentStatus : req.body.shipment.shipmentStatus},{where : {id: req.params.id}}).then(function(data){
    Shipments.findByPk(req.params.id).then(function(data){
      res.send(data);
    })
    
  }).catch(next);
});
router.delete('/:id' , auth.required, function(req, res, next) {
    Shipments.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(){
      res.send({'message' : "Shipment Deleted Successfully."})
    });
});
router.post('/', auth.required, function(req, res, next) {
    var shipment = new Shipments(req.body.shipment);
    return shipment.save().then(function(data){
      res.send(data);
    }).catch(next);
});

module.exports = router;