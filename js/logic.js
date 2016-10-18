window.onload =function(){
  var datafetcher=new DataFetcher();
  var data=datafetcher.getData();
  if(data){
      processData(data);
  }else{
    datafetcher.addGoogleAPI(processData);
  }
}

function processData(data){
	document.open("text/html", "replace");
	if (data.length > 0) {
		console.log(data)
        document.write(JSON.stringify(data));
    } else {
        document.write("No events found!");
    }
    document.close();
}


 
 

