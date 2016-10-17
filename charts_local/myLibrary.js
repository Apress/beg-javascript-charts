/* MY LIBRARY */

function myLibrary(target,data,options){

	var canvas = $(target);
	var margin = options.margins;
	var w = canvas.width() - margin.left - margin.right,
	    h = canvas.height() - margin.top - margin.bottom;


	var ctx = canvas.get(0).getContext("2d");
	if(options.type === 'pie'){
		ctx.strokeRect(margin.left,margin.top,w,h);
	}else{		
		ctx.translate( 0, canvas.height() );
		ctx.strokeRect(margin.left,-margin.bottom,w,-h);
        }


    if(options.type === 'line' || options.type === 'bar'){
        var minVal = 0;
	var maxVal = 0;
	data.forEach(function(d,i){
		var min = Math.min.apply(null, d);
		if(min < minVal)
			minVal = min;
		var max = Math.max.apply(null, d);
		if(max > maxVal)
			maxVal = max;
	});
	maxVal = 1.1 * maxVal;
		
	//calculate yLabels
	var yLabels = [];
	var yDeltaPixels = 30;
	var nTicks = Math.round(h / yDeltaPixels);
	var yRange = maxVal - minVal;
	var yDelta = Math.ceil(yRange / nTicks);
	var yVal = minVal;
	while( yVal < (maxVal - yDelta)){
		yLabels.push(yVal);
		yVal += yDelta;
	}
	yLabels.push(yVal);
	yLabels.push(maxVal);

	//draw xLabels
	if(options.type === 'line'){
		var xDelta = w / (options.categories.length -1 );
	}
	if(options.type === 'bar'){
		var xDelta = w / (options.categories.length);	
	}
	var xlabelsUL = $('<ul class="labels-x"></ul>')
		.width(w)
		.height(h)
		.insertBefore(canvas);
	$.each(options.categories, function(i){
		var thisLi = $('<li><span class="label">'+this+'</span></li>')
			.prepend('<span class="line" />')
			.css('left', xDelta * i)
			.width(0)
			.appendTo(xlabelsUL);
		var label = thisLi.find('span.label');
		
		if(options.type === 'line'){
			label
				.addClass('label');
		}
		if(options.type === 'bar'){
			label
				.css('margin-left', '40px')
				.addClass('label');
		}
	});
	
	//draw yLabels
	var yScale = h / yRange;
	var liBottom = h / (yLabels.length-1);
	var ylabelsUL = $('<ul class="labels-y"></ul>')
		.width(w)
		.height(h)
		.insertBefore(canvas);
	$.each(yLabels, function(i){  
		var thisLi = $('<li><span>'+this+'</span></li>')
			.prepend('<span class="line"  />')
			.css('bottom',liBottom*i)
			.prependTo(ylabelsUL);
		var label = thisLi.find('span:not(.line)');
		var topOffset = label.height()/-2;
		if(i == 0){ topOffset = -label.height(); }
		else if(i== yLabels.length-1){ topOffset = 0; }
		label
	 	   .css('margin-top', topOffset)
		   .addClass('label');
	});

}

if(options.type === 'line'){
	
	// draw DATA
	ctx.lineWidth = 5;
	for(var i in data){
		var points = data[i];		
		ctx.moveTo(0,-points[i]);
		ctx.strokeStyle = options.colors[i];
		ctx.beginPath();
		var xVal = margin.left;
		for(var j in points){
			var relY = (points[j]*h/maxVal) + 10;
			ctx.lineTo(xVal,-relY);
			xVal += xDelta;
		}
		ctx.stroke();
		ctx.closePath();
	}
}// end of LINE

if(options.type === 'bar'){

       if(typeof options.bar.barGroupMargin!= 'undefined') {
          var barGroupMargin = options.bar.barGroupMargin;
       } else {
          var barGroupMargin = 4;
       }

	for(var i in data){
		ctx.beginPath();
		var n = data.length;
		var lineWidth = (xDelta-barGroupMargin*2)/n;
		var strokeWidth = lineWidth - (barGroupMargin*2);	
	          ctx.lineWidth = strokeWidth;
		var points = data[i];
		var xVal = (xDelta - n*strokeWidth - (n-1)*(lineWidth - strokeWidth))/2;
		for(var j in points){	
			var relX = margin.left + (xVal-barGroupMargin)+(i*lineWidth)+lineWidth/2;
			ctx.moveTo(relX,-margin.bottom);
			var relY = margin.bottom + points[j]*h/maxVal;			
			ctx.lineTo(relX,-relY);
			xVal += xDelta;
		}
		ctx.strokeStyle = options.colors[i];
		ctx.stroke();
		ctx.closePath();
	}

}// end of bar

if(options.type === 'pie'){

	var pieMargin = margin.top + 50;
	var centerx = Math.round(w/2)+margin.left;
	var centery = Math.round(h/2)+margin.top;
	var radius = centery - pieMargin;				
	var counter = 0.0;

	var dataSum = function(){
		var dataSum = 0;
		for(var i in data){
			var points = data[i];
			for(var j in points){
				dataSum += points[j];
			}
		}
		return dataSum;
	}	
	var dataSum = dataSum();

	var labels = $('<ul class="labels"></ul>')
			.css('list-style','none')
			.insertBefore(canvas);
	
	for(var i in data){
		var sum = 0;
		var points = data[i];
		for(var j in points){
			sum += points[j];
		}
		var fraction = sum/dataSum;
		ctx.beginPath();
		ctx.moveTo(centerx, centery);
		ctx.arc(centerx, centery, radius, 
		       counter * Math.PI * 2 - Math.PI * 0.5,
		      (counter + fraction) * Math.PI * 2 - Math.PI * 0.5, false);
		ctx.lineTo(centerx, centery);
		ctx.closePath();
		ctx.fillStyle = options.colors[i];
		ctx.fill();
		var sliceMiddle = (counter + fraction/2);
		var distance = radius * 1.2;
		var labelx = Math.round(centerx + Math.sin(sliceMiddle * Math.PI * 2) * (distance));
		var labely = Math.round(centery - Math.cos(sliceMiddle * Math.PI * 2) * (distance));
		var leftPlus = (labelx < centerx) ? '40' : '0' ;
		var percentage = parseFloat((fraction*100).toFixed(2));
		var labelval = percentage + "%";
		var labeltext = $('<span class="label">' + labelval +'</span>')
	                .css('font-size', radius / 8)		
		            .css('color', options.colors[i])
		            .css('font-weight', 'bold');
		var label = $('<li class="label-pos"></li>')
	                .appendTo(labels)
	                .css({left: labelx-leftPlus, top: labely,position: 'absolute',  padding:0})
	                .append(labeltext);	           
		counter+=fraction;	
	}
}


//draw the legend
var legendList = $('<ul class="legend"></ul>')
	.insertBefore(canvas);
for(var i in options.series){
	$('<li>'+ options.series[i] +'</li>')
	.prepend('<span style="background: '+ options.colors[i] +'" />')
	.appendTo(legendList);
}



};