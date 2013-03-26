/**
 * randgraph.js -- generate random graphs with n number of vertices and 
 * weighted edges between each vertex
 */

var windowLoad = (function() {

  var _doc = {
    canvas: null,
    context: null,
    title: null
  };
  
  /* begin graph-specific objects */
  function _Edge() {
    this.id = 0;
    this.weight = 0;
    this.verta = null;
    this.vertb = null;
    this.color = {
      r:0,
      g:0,
      b:0
    };
  };
  
  var _graph = {
    edges: [],
    n: 0,
    vertices: []
  };
  
  function _Vertex() {
    this.id = 0;
    this.posx = 0;
    this.poxy = 0;
  };
  /* end graph-specific objects */

  function _calc_edge(x) {
    var edges = 0;
    var last = 0;
    for(var i=0; i<=x; i++) {
      last = i;
      edges = (edges+i)-1;
    }
    return ++edges;
  };
  
  function _calc_weight(x,y) {
    // calc the weight of the edge between vertices x and y
    var xposx = x.posx, xposy = x.posy, yposx = y.posx, yposy = y.posy;
    var posx = 0, posy = 0;
    if(xposx < yposx) {
      posx = (yposx-xposx);
    } else {
      posx = (xposx-yposx);
    }
    if(xposy < yposy) {
      posy = (yposy-xposy);
    } else {
      posy = (xposy-yposy);
    }
    if(posx < posy) {
      return (posy-posx);
    } else {
      return (posx-posy);
    }
  };

  function _factorial(n) {
    if(n<=1) return 1;
    return n*_factorial(n-1);
  };

  function init() {
    console.log("windowLoad.init()");
    _randgraph_init();
    _randgraph();
  };
  
  function _randgraph() {
    // vertices
    for(var i=0; i<_graph.n; i++) {
      var vertex = new _Vertex();
      vertex.id = i;
      vertex.posx = _rand(0,_doc.canvas.height*2);
      vertex.posy = _rand(0,_doc.canvas.width*2);
      console.log('vert:id['+vertex.id+']px['+vertex.posx+']py['+vertex.posy+']');
      _graph.vertices.push(vertex);
    }
    // edge calculation based on number of vertices (okay)
    /*
    var edges = _calc_edge(_graph.n);
    for(var i=0; i<edges; i++) {
      var edge = new Edge();
      edge.id = i;
      edge.verta = null;
      edge.vertb = null;
      edge.weight = 0;
      _graph.edges.push();
    }
    */
    // edge calculation based on extant vertices in array (better)
    // (for each pair of vertices, traverse edges to detect duplication)
    var place = true;
    //debug1
    alert('vert.len['+_graph.vertices.length+']edges.len['+_graph.edges.length+']');
    for(var i=0; i<_graph.vertices.length; i++) {
      //debug1
      alert('i['+i+']');
      for(var j=0; j<_graph.vertices.length; j++) {
        //debug1
        alert('j['+j+']');
        for(var k=0; k<_graph.edges.length; k++) {
          //debug1
          alert('i['+i+']j['+j+']k['+k+']');
          //debug1
          alert('edges['+k+']verta?['+(_graph.edges[k].verta)+']vertb?['+(_graph.edges[k].vertb)+']');
          // conditions invalidating placement of new edge
          if( ((_graph.edges[k].verta == _graph.vertices[i]) && (_graph.edges[k].vertb == _graph.vertices[j])) || 
            ((_graph.edges[k].verta == _graph.vertices[j]) && (_graph.edges[k].vertb == _graph.vertices[i])) ) {
            place = false;
          }
        }
        // currently no support for reflexive edges
        if(_graph.vertices[i] == _graph.vertices[j]) { place = false; }
        // otherwise, create a new edge and plunk 'er down!
        if(place) {
          //debug1
          alert('**** edge!!! i['+i+']j['+j+']');
          var edge = new _Edge();
          edge.id = _graph.edges.length;
          //debug1
          alert('**** --> id['+edge.id+']');
          edge.verta = _graph.vertices[i];
          //debug1
          alert('**** --> vert.i['+edge.verta+']');
          edge.vertb = _graph.vertices[j];
          //debug1
          alert('**** --> vert.j['+edge.vertb+']');
          edge.weight = _calc_weight(edge.verta, edge.vertb);
          //debug1
          alert('**** --> weight['+edge.weight+']');
          _graph.edges.push(edge);
          continue;
        } else {
          place = true;
        }
      }
    }
  };
  
  function _randgraph_draw() {
    for(var i=0; i<_graph.vertices.length; i++) {
      var posx = _graph.vertices[i].posx, posy = _graph.vertices[i].posy;
      _doc.context.beginPath();
      _doc.context.moveTo((posx-1),posy);
      _doc.context.lineTo((posx+1),posy);
      _doc.context.lineWidth = 2;
      _doc.context.lineCap = 'round';
      _doc.context.stroke();
    }
    for(var i=0; i<_graph.edges.length; i++) {
    }
  };
  
  function _randgraph_init() {
    _graph.n = prompt("number of vertices?");
    _doc.title = document.getElementById('title');
    _doc.canvas = document.getElementById('canvas');
    _doc.context = canvas.getContext('2d');
    _doc.title.innerHTML = '<h2>Random Graph Generator (n = '+ _graph.n +')</h2>';
  };
  
  function _rand(min, max) {
    return _rand_getRandomInt(min, max);
  };
  
  function _rand_getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return { init: init }
}());

if(window.addEventListener) {
  window.addEventListener('load',windowLoad.init,false);
} else {
  window.attachEvent('load',windowLoad.init);
}
