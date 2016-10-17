$(document).ready(function(){
	 
	  var data = [[100,110,140,130,80,75,120,130,100]];
      
	$(document).ready(function(){
		$.jqplot ('myChart', data,
		{ 
			title: 'My first jqPlot chart'
		});
	});

});