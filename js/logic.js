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
	// document.open("text/html", "replace");
	if (data.length > 0) {
      var options = {
        valueNames: [ 'summary', 'dateTime' ],
        item: '<li><h3 class="summary"></h3><p class="dateTime"></p></li>'
      };
		  var userList = new List('list', options, data);
      userList.on('searchComplete',function(list){
        console.log(list.items);
      })
    } else {
      document.write("No events found!");
    }
  // document.close();
}


 
 

