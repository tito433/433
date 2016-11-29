this.analyze=function(callback){
    if(this._data.length==0){
      return 'Not engough data.';
    }

    var response='',
        net = new brain.NeuralNetwork(), 
        input=this._box.map(function(obj){
          var d=obj.date;
          return {'input':{'year':d.getFullYear(),'month':d.getMonth(),'day':d.getDate(),'hour':d.getHours(),'minute':d.getMinutes()},'output':{'event':obj.marked?1:0}};
        });
      
      net.train(input,{
        errorThresh: 0.005,  // error threshold to reach
        iterations: 20000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 100,       // number of iterations between logging
        learningRate: 0.3    // learning rate
      });
      console.log('Training complete.<br/>');

      //predict?
      var counter=0,lastDay=this._box[this._box.length-1].date,
          startDate=new Date(lastDay.getFullYear(),lastDay.getMonth(),lastDay.getDate(),0,0), 
          endDate=new Date();
          endDate.setDate(startDate.getDate()+30);
          

      var timer=setInterval(function(){
        if(startDate>endDate){
          console.log('Analyze completed:'+counter+' days',response);
          clearInterval(timer);
          if(callback) callback(response);

        }else{
          var hour=0,min=0;
          counter++;
          while(hour<=23){
            var sample={'year':startDate.getFullYear(),'month':startDate.getMonth(),'day':startDate.getDate(),'hour':hour,'minute':min};
            var result=net.run(sample);
            if(result.event>0.95){
              response+=startDate+'<br/>';
              console.log('Found:'+startDate+'<br/>');
            }
            min++;
            if(min==60){  hour++; min=0; }
          }
          startDate.setDate(startDate.getDate()+1);

        }
      },1000);
      //sending incomplete data!!!
      return response;
  }