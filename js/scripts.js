var isMobile = false; //initiate as false

// responsiveness
var w=window,
dw=document,
ew=dw.documentElement,
gw=dw.getElementsByTagName('body')[0]
var ww = w.innerWidth||ew.clientWidth||gw.clientWidth
if (ww <= 768){
  // mobile
  isMobile = true;

} else {
  //desktop 
  
}

d3.csv('data/candidates-with-photo-name.csv', function(error,data){
    if (isMobile==true){
      data = _.sortBy(data,'gender')
    }
    d3.select('.grid')
        .selectAll('.photo')
        .data(data)
        .enter()
        .append('div')
        .attr('class',function(d){
            return 'g-'+d.gender + ' photo'
        })
        .style('background-image',function(d){
            return "url('img/all/"+d.photo_name+"')"
        })
        .style('background-size','cover')

})


