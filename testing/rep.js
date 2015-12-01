function getMean(data){
	var sum = 0;
	for(var i=0; i<data.length; i++){
		sum += data[i];
	}
	return sum / data.length;
}

function getFeatures(data){
	var mean = getMean(data);
	var copy = data.slice();
	copy.sort(function(a,b){
		if(a == b){
			return 0;
		}else if (Math.abs(a - mean) < Math.abs(b-mean)) {
			return -1;
		}else{
			return 1;
		}
	});
	var top80 = Math.abs(copy[Math.floor(data.length * 0.8) - 1] - mean)
	var top100 = Math.abs(copy[copy.length - 1] - mean)
	return {'mean': mean, 'top80': top80, 'top100': top100}
}

//determine how probable a point is in a data set - lower is better
function calculateUncertainty(pointValue, featureObject){
	
	/*

			|mean - point|
	0.8  *  --------------
				top80

			|mean - point|
	+ 0.2 * --------------
				top100


		Math.abs((mean - point) / (top80 - point)) 

		0.8 * Math.abs(Math.abs(mean - point) - top80) + 0.2 * Math.abs(Math.abs(mean - point) - top100)

	*/

	var mean = featureObject.mean
	var top80 = featureObject.top80//fyi, I think numbers in variable names are horrible - they were pierce's idea
	var top100 = featureObject.top100

	return (
		0.8 * Math.abs(mean - pointValue) / top80 +
		0.2 * Math.abs(mean - pointValue) / top100
	)

}

//pointValue is a number, featureObjects is an array of the type of objects which come from the getFeatures method
//returns a reference to the closest featureObject, along with its percentage of uncertainty, in an object
/*
{
	feature: featureObject,
	uncertainty: ...
}
*/

function findClosestFeatureObject(pointValue, featureObjects){

	var totalProbability = 0

	var bestUncertainty = calculateUncertainty(pointValue, featureObjects[0])
	var bestIndex = 0

	for(var i = 1; i < featureObjects.length; i++){
		var currentUncertainty = calculateUncertainty(pointValue, featureObjects[i])

		totalProbability += currentUncertainty * currentUncertainty//so the smaller things get smaller and the bigger things get bigger

		if(currentUncertainty < bestUncertainty){
			bestUncertainty = currentUncertainty
			bestIndex = i
		}
	}

	return {
		feature: featureObject,
		uncertainty: bestUncertainty * bestUncertainty / totalProbability
	}


}