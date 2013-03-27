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
    this.midpoint = {
      x:0,
      y:0
    };
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
  
  function _calc_weightMidpoint(edge) {
    // calc the weight and midpoint of the edge between vertices x and y
    var xposx = edge.verta.posx, xposy = edge.verta.posy, yposx = edge.vertb.posx, yposy = edge.vertb.posy;
    var midx = 0, midy = 0, posx = 0, posy = 0;
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
      edge.weight = (posy-posx);
    } else {
      edge.weight = (posx-posy);
    }
    edge.midpoint.x = (posx/2);
    edge.midpoint.y = (posy/2);
  };

  function _factorial(n) {
    if(n<=1) return 1;
    return n*_factorial(n-1);
  };

  function init() {
    console.log("windowLoad.init()");
    _randgraph_init();
    _randgraph_gen();
    _randgraph_draw();
  };
  
  function _randgraph_draw() {
    for(var i=0; i<_graph.edges.length; i++) {
      _doc.context.beginPath();
      _doc.context.moveTo(_graph.edges[i].verta.posx,_graph.edges[i].verta.posy);
      _doc.context.lineTo(_graph.edges[i].vertb.posx,_graph.edges[i].vertb.posy);
      _doc.context.lineWidth = 2;
      _doc.context.strokeStyle = 'rgb(' +
        _graph.edges[i].color.r + ',' +
        _graph.edges[i].color.g + ',' +
        _graph.edges[i].color.b + ');';
      _doc.context.stroke();
    }
    _doc.context.strokeStyle = 'rgb(240,240,240);';
    for(var i=0; i<_graph.vertices.length; i++) {
      var posx = _graph.vertices[i].posx, posy = _graph.vertices[i].posy;
      _doc.context.beginPath();
      _doc.context.arc(posx,posy,2,0,(2*Math.PI),false);
      _doc.context.lineWidth = 4;
      _doc.context.lineCap = 'round';
      _doc.context.stroke();
    }
    _doc.context.font = '10pt Verdana';
    for(var i=0; i<_graph.edges.length; i++) {
      var posx = _graph.edges[i].verta.posx,
        posy = _graph.edges[i].posy,
        str = _graph.edges[i].weight;
      _doc.context.fillText(str,posx,posy);
    }
  };
  
  function _randgraph_gen() {
    // vertices
    for(var i=0; i<_graph.n; i++) {
      var vertex = new _Vertex();
      vertex.id = i;
      vertex.posx = _rand(0,_doc.canvas.width);
      vertex.posy = _rand(0,_doc.canvas.height);
      //debug1
      console.log('vert:id['+vertex.id+']px['+vertex.posx+']py['+vertex.posy+']');
      _graph.vertices.push(vertex);
    }
    // edge calculation based on extant vertices in array
    // (for each pair of vertices, traverse edges to detect duplication)
    var place = true;
    for(var i=0; i<_graph.vertices.length; i++) {
      for(var j=0; j<_graph.vertices.length; j++) {
        for(var k=0; k<_graph.edges.length; k++) {
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
          var edge = new _Edge();
          edge.id = _graph.edges.length;
          edge.verta = _graph.vertices[i];
          edge.vertb = _graph.vertices[j];
          _calc_weightMidpoint(edge);
          edge.color.r = _rand(0,255);
          edge.color.g = _rand(0,255);
          edge.color.b = _rand(0,255);
          _graph.edges.push(edge);
          continue;
        } else {
          place = true;
        }
      }
    }
  };
  
  function _randgraph_init() {
    _graph.n = prompt("number of vertices?");
    _doc.title = document.getElementById('title');
    _doc.canvas = document.getElementById('canvas');
    _doc.context = canvas.getContext('2d');
    _doc.title.innerHTML = '<h2>Complete Graph Generator (n = '+ _graph.n +', random edge weight)</h2>';
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
