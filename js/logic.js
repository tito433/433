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

      var option={
            childTemplate:'<li><h3 class="summary">{summary}</h3><p class="dateTime">{start.dateTime}</p></li>',
            filter:true
          };

      new List(document.getElementById('list'),option)
              .draw(data,[ 'summary', 'start.dateTime' ]);

    } else {
      document.write("No events found!");
    }
  // document.close();
}


 
 

