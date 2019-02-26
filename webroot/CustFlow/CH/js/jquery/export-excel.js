
function addScript(params){
	if(params.length>0){
		for(var i=0;i<params.length;i++){
			var script = document.createElement("script");
			script.src = params[i];	
			script.charset ='utf-8';	
			document.getElementsByTagName("HEAD")[0].appendChild(script);
		}
	}
}

var arr=['../js/jquery/export-clientside/canvas-tools.js','../js/jquery/export-clientside/export-csv.js','../js/jquery/export-clientside/jspdf.min.js','../js/jquery/export-clientside/highcharts-export-clientside.js'];
addScript(arr);