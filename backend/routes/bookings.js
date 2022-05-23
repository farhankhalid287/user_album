var router = require('express').Router();
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const db = require("../models"); // models path depend on your structure
const Bookings = db.bookings;
var auth = require('./auth');
router.delete('/bulk-delete',auth.required,function(req,res,next){
  if(req.body.ids)
  {
    delete_ids = req.body.ids;
    Bookings.destroy({
        where: {
          id: delete_ids
        }
      }).then(function(){
        res.send({'message' : "Bookings Deleted Successfully."})
      });
  }
  else
  {
    res.send({'message' : 'Please Provide valid bookings ids'});
  }
})
router.get('/export',auth.required,function(req,res,next){
  var query = {};
  var limit = 20;
  var offset = 0;
  if(typeof req.query.limit !== 'undefined'){
    limit = parseInt(req.query.limit) || 20;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = parseInt(req.query.offset) || 0;
  }

  if( typeof req.query.shipmentID !== 'undefined' ){
    query.shipmentID =  req.query.shipmentID;
  }
  if( typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined' ){
    date_from = req.query.from + " 00:00:00";
    date_to = req.query.to + " 23:59:59";
    query.createdAt = 
    { 
      [Op.and] : {
        [Op.gte]: date_from,
        [Op.lte]: date_to
      }
    };
  }
  filters = req.query.filters;
  if(filters)
  {
    prepareFilter(filters,query,req,next);
  }
  Bookings.findAll({include: [{
    model: db.shipments,
    required: true
   }],where: query,order: [['id', 'DESC']]  }).then(function(data){
    var { Parser } = require('json2csv')

    const fields = [{
        label: 'Shipment Date',
        value: 'shipment.shipmentDate'
      },{
        label: 'Sender Name',
        value: 'senderName'
      },{
        label: 'Sender Email',
        value: 'senderEmail'
      },{
        label: 'Sender Phone',
        value: 'senderPhone'
      },{
        label: 'Sender Address',
        value: 'senderAddress'
      },{
        label: 'Receiver Name',
        value: 'receiverName'
      },{
        label: 'Receiver Email',
        value: 'receiverEmail'
      },{
        label: 'Receiver Address',
        value: 'receiverAddress'
      },{
        label: 'Estimated Weight',
        value: 'estimatedWeight'
      },{
        label: 'Number Of Boxes',
        value: 'numberOfBoxes'
      },{
        label: 'Origin',
        value: 'origin'
      }]

    const json2csv = new Parser({ fields: fields })

    try {
        const csv = json2csv.parse(data)
        res.attachment('data.csv')
        res.status(200).send(csv)
    } catch (error) {
        console.log('error:', error.message)
        res.status(500).send(error.message)
    }
  }).catch(next);
})
router.get('/', auth.required, function(req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;
  if(typeof req.query.limit !== 'undefined'){
    limit = parseInt(req.query.limit) || 20;
  }

  if(typeof req.query.offset !== 'undefined'){
    offset = parseInt(req.query.offset) || 0;
  }

  if( typeof req.query.shipmentID !== 'undefined' ){
    query.shipmentID = req.query.shipmentID;
  }
  if( typeof req.query.from !== 'undefined' && typeof req.query.to !== 'undefined' ){
    date_from = req.query.from + " 00:00:00";
    date_to = req.query.to + " 23:59:59";
    query.createdAt = 
    { 
      [Op.and] : {
        [Op.gte]: date_from,
        [Op.lte]: date_to
      }
    };
  }
  filters = req.query.filters;
  if(filters)
  {
    prepareFilter(filters,query,req,next);
  }
  Bookings.findAndCountAll({include: [{
    model: db.shipments,
    required: true
   }], where: query,offset: offset, limit: limit ,order: [['id', 'DESC']] }).then(function(data){
      res.send(data);
  }).catch(next);
});
router.get('/:id', auth.required, function(req, res, next) {
  Bookings.findOne({include: [{
    model: db.shipments,
    required: true
   }],where: {id :req.params.id}}).then(function(data){
      res.send(data);
  }).catch(next);
});
router.put('/:id', auth.required, function(req, res, next) {
  Bookings.update(req.body.booking,{where : {id: req.params.id}}).then(function(data){
    Bookings.findByPk(req.params.id).then(function(data){
      res.send(data);
    })
    
  }).catch(next);
});
router.delete('/:id' , auth.required, function(req, res, next) {
    Bookings.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(){
      res.send({'message' : "Booking Deleted Successfully."})
    });
});
router.post('/', auth.optional, function(req, res, next) {
    var booking = new Bookings(req.body.booking);
    return booking.save().then(function(data){
      res.send(data);
    }).catch(next);
});
var prepareFilter = function(filters, query, req, next)
{
  for(let filter_json of filters) {
    filter = JSON.parse(filter_json);
    fieldName = filter.fieldName;
    fieldType = filter.fieldType;
    operator = filter.operator;
    value = filter.value;
    switch(fieldType) {
      case 'date':
        switch (operator)
        {
          case '=':
            query[fieldName] = {
              [Op.eq]: value,
            }
            break;
          case '!=':
            query[fieldName] = {
              [Op.ne]: value,
            }
            break;
          case '>' : 
            query[fieldName] = {
              [Op.gt]: value,
            }
            break;
          case '>=' : 
            query[fieldName] = {
              [Op.gte]: value,
            }
            break;
          case '<' : 
            query[fieldName] = {
              [Op.lt]: value,
            }
            break;
          case '<=' : 
            query[fieldName] = {
              [Op.lte]: value,
            }
            break;
        }
        break;
      case 'text':
        switch (operator)
        {
          case 'exactly':
            query[fieldName] = {
              [Op.eq]: value,
            }
            break;
          case 'not equals':
            query[fieldName] = {
              [Op.ne]: value,
            }
            break;
          case 'contain' : 
            query[fieldName] = {
              [Op.like]: '%'+value+'%',
            }
            break;
          case 'not contain' : 
            query[fieldName] = {
              [Op.notLike]: '%'+value+'%',
            }
            break;
        }
        // code block
        break;
      case 'number' : 
        switch (operator)
        {
          case '=':
            query[fieldName] = {
              [Op.eq]: value,
            }
            break;
          case '!=':
            query[fieldName] = {
              [Op.ne]: value,
            }
            break;
          case '>' : 
            query[fieldName] = {
              [Op.gt]: value,
            }
            break;
          case '>=' : 
            query[fieldName] = {
              [Op.gte]: value,
            }
            break;
          case '<' : 
            query[fieldName] = {
              [Op.lt]: value,
            }
            break;
          case '<=' : 
            query[fieldName] = {
              [Op.lte]: value,
            }
            break;
        }
        break;
      default:
        // code block
    }
  }
};
module.exports = router;