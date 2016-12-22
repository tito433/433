function Logo(opt){
	Canvas.call(this,opt.dom.output);

	var ctx=this._ctx;

	//draw cricle
	var center=new Point(this.width/2,this.height/2);
	var radius=150;

	ctx.save();
    ctx.beginPath();
    ctx.strokeStyle='#aaa';
    ctx.lineWidth=4;
    ctx.arc(center.x,center.y,radius,0,2*Math.PI);
    ctx.stroke();
    ctx.restore();
  	var points=[];
	//get positions
	for(var i=1;i<=9;i++){
		var deg=(i*40)-90,degRad=deg*Math.PI/180;
        points[i]=new Point(center.x+radius*Math.cos(degRad),center.y+radius*Math.sin(degRad));
	}
	//draw connection
	var connecion=[1,2,4,8,7,5];
	ctx.save();
    ctx.beginPath();
    ctx.strokeStyle='#ccc';
    ctx.lineWidth=3;
    ctx.moveTo(points[connecion[0]].x,points[connecion[0]].y);
    for(var i=1,ln=connecion.length;i<ln;i++){
    	ctx.lineTo(points[connecion[i]].x,points[connecion[i]].y);
    }
	ctx.closePath();
	ctx.stroke();
	//draw poller
	ctx.save();
    ctx.beginPath();
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle='#abc';
    ctx.lineWidth=3;
    ctx.moveTo(points[3].x,points[3].y);
    ctx.lineTo(points[9].x,points[9].y);
    ctx.lineTo(points[6].x,points[6].y);
	ctx.stroke();
	ctx.restore();

}