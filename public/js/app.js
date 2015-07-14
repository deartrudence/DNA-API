//name our angular app
var app = angular.module('dnaApp', ['ui.router', 'ngRoute'])

console.log("in app");

app.config(function($stateProvider){
	console.log("in state")
	$stateProvider
		.state('index', {
			url: '',
			controller: 'getQuoteCtrl',
			templateUrl: '../views/quotes.html'
		})
		.state('posting', {
			url: '/posting',
			controller: 'postQuoteCtrl',
			templateUrl: '../views/post.html'
		})
});

app.factory('Quotes', function($http, $q){
	var url = 'https://elegant-madame-7790.herokuapp.com/api/v1/quotes';

	return{
		getQuote: function(){
			var def = $q.defer();
			$http.get(url)
				.success(def.resolve)
				.error(def.reject);
			return def.promise
		},
		getQuoteRandom : function(){
			console.log("clicked")
			var def = $q.defer();
			$http.get(url + '/random')
				.success(def.resolve)
				.error(def.reject);
			return def.promise
		},
		getTags : function(){
			var def = $q.defer();
			$http.get(url + '/tags')
				.success(def.resolve)
				.error(def.reject);
			return def.promise
		},
		getQuoteByTag : function(tagio){
			var def = $q.defer();
			$http.get(url + '/tag/'+ tagio)
				.success(def.resolve)
				.error(def.reject);
			return def.promise
		},
		getBooks : function(){
			var def = $q.defer();
			$http.get(url + '/books')
				.success(def.resolve)
				.error(def.reject);
			return def.promise
		},
		getQuoteByBook : function(bookio){
			var def = $q.defer();
			$http.get(url + '/book/' + bookio)
				.success(def.resolve)
				.error(def.reject);
			return def.promise
		},
		postQuote: function(model){
			var def = $q.defer();
			$http.post(url, model)
				.success(def.resolve);
				// console.log(model)
			return def.promise
		}
	}
});

 // -------------CONTROLLERS---------------------------------

app.controller('getQuoteCtrl', function($q, $scope, Quotes){
	console.log("in get")

	Quotes.getQuote().then(function(res){
		$scope.quotes = res;
		// console.log($scope.quotes);
	});

});

app.controller('getTagsCtrl', function($q, $scope, Quotes){
	console.log("in all tags");

	Quotes.getTags().then(function(res){
		$scope.tags = res;
		console.log("tags: "+ $scope.tags)
	});

	$scope.getQuoteByTag = function(){
		Quotes.getQuoteByTag($scope.tag).then(function(data){
			$scope.quotes = data;
			console.log("by tags: "+ $scope.tag)
		});
	};
});

app.controller('getBooksCtrl', function($q, $scope, Quotes){
	console.log("in the books");

	Quotes.getBooks().then(function(res){
		$scope.books = res
		console.log("books: " + $scope.books)
	});

	$scope.getQuoteByBook = function(){
		Quotes.getQuoteByBook($scope.book).then(function(data){
			$scope.quotes = data;
			console.log("by books :" + $scope.book)
		})
	}
});

app.controller('getQuoteRandomCtrl', function($q, $scope, Quotes){

	Quotes.getQuoteRandom().then(function(res){
		$scope.quote = res;
		// $scope.tag = tag;
		console.log("RANDOM: " + $scope.quote);
	});

	$scope.getQuoteRandom = function(){
		Quotes.getQuoteRandom().then(function(data){
			$scope.quote = data;
			console.log("function: " + $scope.quote)
		});
	};
});



app.controller('postQuoteCtrl', function($scope, Quotes){
	console.log("in post controller")
	$scope.addNew = function(){
		console.log("am i positng?")

		Quotes.postQuote($scope.quote).then
		(function(res){
			if(res.status !== 'error'){
				// $scope.quotes.push($scope.quote);
				console.log('i am posting a quote' + res);
			}else{
				console.log("error, error!")
			}
		});
	};
});

