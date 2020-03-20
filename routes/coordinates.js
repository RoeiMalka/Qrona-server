var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var router = express.Router();

var epsilon = 0.00001;    //0.00001 in coordinates = 1 meters
const defaultRadius = 10; //If customer doesn't send a radius

//Schema:
var CoordinatesSchema = new mongoose.Schema({
  lat: {type:String},
  lng: {type:String}

});

//Model:
var Coordinate = mongoose.model('coordinates', CoordinatesSchema);
var allCoords = {}


/* GET users listing. /lat=32.232&lon=32.33&radius=20*/
router.get('/',cors(),function(req, res, next) {
  var currCoors = req.query;
  var isok=true;
  console.log(currCoors);
  if (!currCoors.radius) {
    currCoors.radius = defaultRadius;
  }
  epsilon=epsilon*parseFloat(currCoors.radius);
  var coords = Coordinate.find({} ,(err, coords) => {
    coords.forEach((item) => {
      //Check distance:
      if (((parseFloat(currCoors.lat)-parseFloat(item.lat))**2+(parseFloat(currCoors.lng)-parseFloat(item.lng))**2)**0.5 < epsilon) {
        res.send(true);
        isok=false;

        }
    });
    if (isok) res.send(false);

  });
});



router.get('/polygons',cors(),async function(req, res) {
  let areas = [];
  var keys = await Coordinate.find({}).distinct('key').exec();
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == 0) {
      continue;
    }
    let arr = await Coordinate.find({'key':keys[i]}).select('-_id').select('-key').exec();
    areas.push(arr);
  }
  res.send(areas);
});

router.get('/allcords',cors(),async function(req, res) {
  let arr = await Coordinate.find({'key':0}).select('-_id').select('-key').exec();
  res.send(arr);


});


module.exports = router;
