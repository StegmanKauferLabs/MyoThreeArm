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
