const express =require('express') ;
const cors = require('cors') ;
const cookieParser=require('cookie-parser')
const userRoutes = require('./routes/user.route') ;
const captainRoutes = require('./routes/captain.route');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

 const app = express() ;
 
 app.use(cors()) ;
 app.use(express.json());
 app.use(cookieParser());
 app.use(express.urlencoded({ extended: true }));



app.use('/users', userRoutes) ;
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);


module.exports=app
