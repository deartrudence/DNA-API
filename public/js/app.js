//name our angular app
var app = angular.module('dnaApp', ['ui.router', 'ngRoute'])

console.log("in app");

app.factory('Quotes', function($http, $q){
	var url = 'http://localhost:8080/api/quotes';

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
		postQuote: function(model){
			var def = $q.defer();
			$http.post(url, model)
				.success(def.resolve);
				// console.log(model)
			return def.promise
		}
	}
});

app.controller('getQuoteCtrl', function($q, $scope, Quotes){
	console.log("in get")

	Quotes.getQuote().then(function(res){
		$scope.quotes = res;
		// console.log($scope.quotes);
	});


});

app.controller('getQuoteRandomCtrl', function($q, $scope, Quotes){
	console.log("in get tag")

	Quotes.getQuoteRandom().then(function(res){
		$scope.quote = res;
		// $scope.tag = tag;
		console.log($scope.quote);
	});

	$scope.getQuoteRandom = function(){
		Quotes.getQuoteRandom().then(function(data){
			$scope.quote = data;
			console.log("function: " + data)
		});
	};
});


app.controller('postQuoteCtrl', function($scope, Quotes){

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

