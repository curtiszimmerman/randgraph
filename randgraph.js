/**
 * randgraph.js -- generate random graphs with n number of vertices and 
 * weighted edges between each vertex
 */

var windowLoad = (function() {

  var _doc = {
    canvas: null,
    context: null,
    font: null,
    form: null,
    submit: null,
    title: null
  };
  
  /* begin graph-specific objects */
  function _Edge() {
    this.id = 0;
    this.midpoint = {
      x:0,
      y:0
    };
    this.slope = 0;
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
    graph: {
      edges: [],
      n: 0,
      vertices: []
    },
    tree: {
      a: 0,
      edges: [],
      height: 0,
      n: 0,
      nodes: []
    },
    type: null
  };
  
  function _Vertex() {
    this.id = 0;
    this.posx = 0;
    this.poxy = 0;
  };
  /* end graph-specific objects */

  function _calc_edge(x) {
    var edges = 0;
    for(var i=0; i<=x; i++) {
      edges = (edges+i)-1;
    }
    return ++edges;
  };
  
  function _calc_weightMidpoint(edge) {
    // calc the weight and midpoint of the edge between vertices x and y, as well as slope for nice labels
    var aposx = edge.verta.posx, aposy = edge.verta.posy, bposx = edge.vertb.posx, bposy = edge.vertb.posy;
    var offsetx = 0, offsety = 0, posx = 0, posy = 0, slopex = 0, slope = 0;
    if(aposx < bposx) {
      slopex = 1;
      offsetx = aposx;
      posx = (bposx-aposx);
    } else {
      offsetx = bposx;
      posx = (aposx-bposx);
    }
    if(aposy < bposy) {
      offsety = aposy;
      posy = (bposy-aposy);
    } else {
      offsety = bposy;
      posy = (aposy-bposy);
    }
    if(slopex) {
      edge.slope = (bposy-aposy)/(bposx-aposx);
    } else {
      edge.slope = (aposy-bposy)/(aposx-bposx);
    }
    edge.weight = Math.round(Math.sqrt((posx*posx)+(posy*posy)));
    edge.midpoint.x = (offsetx+(posx/2));
    edge.midpoint.y = (offsety+(posy/2));
  };
  
  function event(element, event, payload) {
    if(window.addEventListener) {
      element.addEventListener(event, payload, false);
    } else {
      element.attachEvent(event, payload);
    }
  };

  function _factorial(n) {
    if(n <= 1) { return 1; }
    return n*_factorial(n-1);
  };

  function init() {
    console.log("windowLoad.init()");
    _process();
    _doc.canvas = document.getElementById('canvas');
    _doc.context = canvas.getContext('2d');
    _doc.form = document.getElementById('form');
    _doc.submit = document.getElementById('submit');
    _doc.title = document.getElementById('title');
    var input_ary = document.getElementById('input_ary'),
      input_graph = document.getElementById('input_graph'),
      input_tree = document.getElementById('input_tree'),
      input_vertices = document.getElementById('input_vertices');
    input_graph.checked = true;
    input_ary.disabled = true;
    event(_doc.submit, 'click', _submit);
    event(input_graph,'click',function() {
      input_tree.checked = false;
      input_ary.disabled = true;
    });
    event(input_tree,'click',function() {
      input_graph.checked = false;
      input_ary.disabled = false;
    });
    //fix default this to 3 or something, then steer user to option form
    //debug2 -- default to a graph for great justice
    _graph.graph.n = prompt("number of vertices?");
    _graph.type = 'graph';
    if(_graph.type === 'graph') {
      _randgraph();
    } else if(_graph.type === 'tree') {
      _randtree();
    }
  };
  
  function _process() {
  };
  
  // default return type is int
  function _rand(min, max, type) {
    type = (typeof(type) === 'undefined') ? 'int' : type;
    if(type === 'int') {
      return _rand_getRandomInt(min, max);
    } else if(type === 'float') {
      return _rand_getRandomFloat(min, max);
    }
  };
  
  //fix -- return a better float than one between 0.0 and 0.0 ;)
  function _rand_getRandomFloat(min, max) {
    return 0.0;
  };
  
  function _rand_getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  function _randgraph() {
    _randgraph_init();
    _randgraph_gen();
    _randgraph_draw();
  };
  
  function _randgraph_draw() {
    for(var i=0; i<_graph.graph.edges.length; i++) {
      _doc.context.beginPath();
      _doc.context.moveTo(_graph.graph.edges[i].verta.posx,_graph.graph.edges[i].verta.posy);
      _doc.context.lineTo(_graph.graph.edges[i].vertb.posx,_graph.graph.edges[i].vertb.posy);
      _doc.context.lineWidth = 2;
      _doc.context.strokeStyle = 'rgb(' +
        _graph.graph.edges[i].color.r + ',' +
        _graph.graph.edges[i].color.g + ',' +
        _graph.graph.edges[i].color.b + ');';
      _doc.context.stroke();
    }
    _doc.context.strokeStyle = 'rgb(240,240,240);';
    _doc.context.lineWidth = 4;
    _doc.context.lineCap = 'round';
    for(var i=0; i<_graph.graph.vertices.length; i++) {
      var posx = _graph.graph.vertices[i].posx, posy = _graph.graph.vertices[i].posy;
      _doc.context.beginPath();
      _doc.context.arc(posx,posy,2,0,(2*Math.PI),false);
      _doc.context.stroke();
    }
    _doc.context.font = 'bold 10pt Verdana';
    _doc.context.fillStyle = 'rgb(255,255,255)';
    _doc.context.lineWidth = 1;
    for(var i=0; i<_graph.graph.edges.length; i++) {
      var posx = _graph.graph.edges[i].midpoint.x,
        posy = _graph.graph.edges[i].midpoint.y,
        slope = _graph.graph.edges[i].slope,
        str = _graph.graph.edges[i].weight;
      _doc.context.beginPath();
      _doc.context.moveTo(posx,posy);
      if(slope < 0) {
        _doc.context.fillText(str,posx+10,posy+10);
        _doc.context.lineTo(posx+10,posy+10);
      } else {
        _doc.context.fillText(str,posx+10,posy-10);
        _doc.context.lineTo(posx+10,posy-10);
      }
      _doc.context.stroke();
    }
  };
  
  function _randgraph_gen() {
    // vertices
    for(var i=0; i<_graph.graph.n; i++) {
      var vertex = new _Vertex();
      vertex.id = i;
      vertex.posx = _rand(0,_doc.canvas.width);
      vertex.posy = _rand(0,_doc.canvas.height);
      //debug1
      console.log('vert:id['+vertex.id+']px['+vertex.posx+']py['+vertex.posy+']');
      _graph.graph.vertices.push(vertex);
    }
    // edge calculation based on extant vertices in array
    // (for each pair of vertices, traverse edges to detect duplication)
    var place = true;
    for(var i=0; i<_graph.graph.vertices.length; i++) {
      for(var j=0; j<_graph.graph.vertices.length; j++) {
        for(var k=0; k<_graph.graph.edges.length; k++) {
          // conditions invalidating placement of new edge
          if( ((_graph.graph.edges[k].verta == _graph.graph.vertices[i]) && (_graph.graph.edges[k].vertb == _graph.graph.vertices[j])) || 
            ((_graph.graph.edges[k].verta == _graph.graph.vertices[j]) && (_graph.graph.edges[k].vertb == _graph.graph.vertices[i])) ) {
            place = false;
          }
        }
        // currently no support for reflexive edges
        if(_graph.graph.vertices[i] == _graph.graph.vertices[j]) { place = false; }
        // otherwise, create a new edge and plunk 'er down!
        if(place) {
          var edge = new _Edge();
          edge.id = _graph.graph.edges.length;
          edge.verta = _graph.graph.vertices[i];
          edge.vertb = _graph.graph.vertices[j];
          _calc_weightMidpoint(edge);
          edge.color.r = _rand(0,255);
          edge.color.g = _rand(0,255);
          edge.color.b = _rand(0,255);
          _graph.graph.edges.push(edge);
          continue;
        } else {
          place = true;
        }
      }
    }
  };
  
  function _randgraph_init() {
    _doc.title.innerHTML = '<h2>Complete Graph Generator (n = '+ _graph.graph.n +' vertices, random edge weight)</h2>';
  };
  
  function _randtree() {
    _randtree_init();
    _randtree_gen();
    _randtree_draw();
  };

  function _randtree_draw() {
  };
  
  function _randtree_gen() {
    _graph.tree.height = Math.floor(_graph.tree.n / _graph.tree.a);
    //debug1
    console.log('height:['+_graph.tree.height+'] ['+_graph.tree.a+']-ary tree with ['+_graph.tree.n+'] nodes');
    for(var i=0; i<_graph.tree.n; i++) {
      var vertex = new _Vertex();
      vertex.id = i;
      vertex.posx = _rand(0,_doc.canvas.width);
      vertex.posy = _rand(0,_doc.canvas.height);
      //debug1
      console.log('node:id['+vertex.id+']px['+vertex.posx+']py['+vertex.posy+']');
      _graph.tree.vertices.push(vertex);
    }
  };
    
  function _randtree_init() {
    _doc.title.innerHTML = '<h2>N-ary Tree Generator (n = '+ _graph.tree.n +' nodes, a = '+_graph.tree.a+')</h2>';
  };
  
  function _submit() {
    var ary = _doc.form.getElementById('input_ary'),
      graph = _doc.form.getElementById('input_graph'),
      tree = _doc.form.getElementById('input_tree'),
      vertices = _doc.form.getElementById('input_vertices');
    if(graph.checked == true) {
      _graph.type = 'graph';
      _graph.graph.n = vertices;
      _randgraph();
    } else if(tree.checked == true) {
      _graph.type = 'tree';
      _graph.graph.a = ary;
      _graph.graph.n = vertices;
      _randtree();
    }
  };

  return {
    event: event,
    init: init
  }
}());

// fire it up!
windowLoad.event(window,'load',windowLoad.init);
