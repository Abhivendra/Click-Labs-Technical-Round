'use strict';

var App = angular.module('ClickLabApp', []);
App.controller("ClickCtrl", function ($scope , $http ) {
	$scope.result=[]; 
	   
	$http.get('data.json')
		.success(function (data){
			console.log("json data:" , data)
			var distanceData = data;
			var len=data.length;
			for(var i=0 ; i<len ; i++){
				var picLong=distanceData[i].pickup_longitude;
				var picLat=distanceData[i].pickup_latitude;
				var dropLong=distanceData[i].drop_longitude;
				var dropLat=distanceData[i].drop_latitude;
				var givenDistance=distanceData[i].metered_distance * 1000;
				var givenTime=distanceData[i].metered_time*60;
				// console.log("picLong" , picLong);
				// console.log("picLat" , picLat);
				// console.log("dropLong" , dropLong);
				// console.log("dropLat" , dropLat);
					var request = new XMLHttpRequest(); 
					request.open('GET', "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+picLat+","+picLong+"&destinations="+dropLat+","+dropLong+"&mode=driving&language=en-EN&key=AIzaSyBIGk07jqZp0deHiXNsgIAomfVtgan02v0", false);  // `false` makes the request synchronous
					request.send(null);

					if (request.status === 200) {
					  console.log("hi::",request.responseText);
					}
					data=request.responseText
					data=JSON.parse( data);
				// $http.get("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+picLat+","+picLong+"&destinations="+dropLat+","+dropLong+"&mode=driving&language=en-EN&key=AIzaSyBIGk07jqZp0deHiXNsgIAomfVtgan02v0")
				// 	.success(function (data){
					console.log("json data:" ,data);
					var googleDistance=data.rows[0].elements[0].distance.value;
					var googleTime=data.rows[0].elements[0].duration.value;
					$scope.resultDistancePercentage=100*Math.abs(givenDistance-googleDistance)/googleDistance;
						
					$scope.resultTimePercentage=100*Math.abs(givenTime-googleTime)/googleTime;

					// console.log("$scope.resultDistancePercentage" , $scope.resultDistancePercentage);
					// console.log("i:" , i)
					// console.log("$scope.distanceData[i]" , distanceData)
					// });
					var isFaulty="No";
					// Fault Check
					if($scope.resultDistancePercentage > 10 || $scope.resultTimePercentage > 10){
						isFaulty="Yes";

					}
				$scope.result.push({
						engagement_id:distanceData[i].engagement_id,
						metered_distance: distanceData[i].metered_distance,
						metered_time: distanceData[i].metered_time,
						time_deviation:$scope.resultTimePercentage,
						distance_deviation:$scope.resultDistancePercentage,
						faulty: isFaulty
				});
				


				


				
			}

				
		});
	

    
});
