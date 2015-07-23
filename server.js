

// Call packages
var express 		= require('express');
var app 			= express();
var bodyParser		= require('body-parser');
var morgan			= require('morgan');
var mongoose		= require('mongoose');
var random 			= require('mongoose-random');
var port 			= process.env.PORT || 8080 ;

var Quote			= require('./app/models/quote')

var path = require("path");

// App Configuration

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//configure our app to handle CORS requests
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//log all requests to console
app.use(morgan('dev'));

//setup location for static files
app.use(express.static(__dirname + '/public'));
//ROUTES
//homepage route
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/post', function(req, res){
	res.sendFile(path.join(__dirname + '/public/views/post.html'));
});

//connect to database
mongoose.connect(process.env.MONGOLAB_URI || 'localhost:27017/apiDatabase')

//Routes for API

// app.get('/', function(req,res){
// 	res.send('Welcome to the home page!');
// });

//get instance of express router
var apiRouter = express.Router();

// middleware to user for all requests
apiRouter.use(function(req,res,next){
	//do loggin
	console.log("somebody came to our app!");
	next();
});

//test route
// apiRouter.get('/', function(req,res){
// 	res.json({message: 'hooray! welcome to API'});
// });


apiRouter.route('/quotes')

	.post(function(req,res){

		var quote = new Quote();

		quote.words = req.body.words;
		quote.book  = req.body.book;
		quote.tags  = req.body.tags;

		quote.save(function(err){
			if(err){
				return res.send(err);
			}
			res.json({message: 'Quote Created!'});
		});
	})

	.get(function(req,res){
		Quote.find(function(err, quotes){
			if (err) res.send(err);

			res.json(quotes);

		});
	// });

	});

apiRouter.route('/quotes/tag/:tag')
	.get(function(req,res){
		var theTag = req.param('tag');
		var theTags = theTag.split('&');
		Quote.find({tags:{$all:theTags}}, function(err, quotes){
		if (err) res.send(err);

		res.json(quotes);
		})
	});

apiRouter.route('/quotes/tags')
	.get(function(req,res){
		Quote.distinct('tags').exec(function(err, tags){
			if (err) res.send(err);

			res.json(tags);
		})
	});

apiRouter.route('/quotes/book/:book')
	.get(function(req,res){
		Quote.find({book: req.params.book}, function(err, quotes){
			if (err) res.send(err);

			res.json(quotes)
		})
	});
apiRouter.route('/quotes/books')
	.get(function(req,res){
		Quote.distinct("book").exec(function(err, books){
			if (err) res.send(err);

			res.json(books);
		})
	});

apiRouter.route('/quotes/id/:id')
	.get(function(req,res){
		var q_id = mongoose.Types.ObjectId(req.params.id);
		Quote.find({_id: q_id}, function(err, quotes){
			if (err) res.send(err);

			res.json(quotes)
		})
		console.log("REQ"+ req.params)
	});

apiRouter.route('/quotes/random')
	.get(function(req,res){
		Quote.count(function(err, count){
		var random = Math.ceil(Math.random() * (count -1) )
		Quote.find().limit(1).skip(random).exec(function(err, quote){
			if (err) res.send(err);
			res.json(quote)
		})
			
		})
	});

// register routes
app.use('/api/v1', apiRouter);
//start server
app.listen(port);
console.log("the magic happens on port: "+ port);