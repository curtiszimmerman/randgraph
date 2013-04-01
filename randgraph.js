/**
 * randgraph.js -- generate random graphs with n number of vertices and 
 * weighted edges between each vertex
 */

var randGraph = (function() {

  var _this = {
    add: null,
    canvas: {
      canvas: null,
      height: 0,
      width: 0
    },
    context: null,
    doc: null,
    font: null,
    form: null,
    reset: null,
    title: null
  };
  
  /* begin graph-specific objects */
  function _Edge() {
    this.id = 0;
    this.verta = null;
    this.vertb = null;
    this.color = {
      r:0,
      g:0,
      b:0
    };
  };
  
  function _EdgeWeighted() {
    this.midpoint = {
      x: 0,
      y: 0
    };
    this.slope = 0;
    this.weight = 0;
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
      heightTree: 0,
      n: 0,
      nodes: [],
      widthNode: 0,
      widthTree: 0
    },
    type: null
  };
  
  function _Node() {
    this.children = [];
    this.level = 0;
    this.levelNode = 0;
    this.parent = null;
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
    _this.doc = document;
    _this.canvas.canvas = _this.doc.getElementById('canvas');
    _this.canvas.height = _this.canvas.canvas.height;
    _this.canvas.width = _this.canvas.canvas.width;
    _this.context = _this.canvas.canvas.getContext('2d');
    _this.form = _this.doc.getElementById('form');
    _this.add = _this.doc.getElementById('submit_add');
    _this.reset = _this.doc.getElementById('submit_reset');
    _this.title = _this.doc.getElementById('title');
    var input_ary = _this.doc.getElementById('input_ary'),
      input_graph = _this.doc.getElementById('input_graph'),
      input_tree = _this.doc.getElementById('input_tree'),
      input_vertices = _this.doc.getElementById('input_vertices');
    input_graph.checked = true;
    input_ary.disabled = true;
    event(_this.add,'click',_submit);
    event(_this.reset,'click',_submit_reset);
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
    /*
    _graph.graph.n = prompt("number of vertices?");
    _graph.type = 'graph';
    if(_graph.type === 'graph') {
      _randgraph();
    } else if(_graph.type === 'tree') {
      _randtree();
    }
    */
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
      _this.context.beginPath();
      _this.context.moveTo(_graph.graph.edges[i].verta.posx,_graph.graph.edges[i].verta.posy);
      _this.context.lineTo(_graph.graph.edges[i].vertb.posx,_graph.graph.edges[i].vertb.posy);
      _this.context.lineWidth = 2;
      _this.context.strokeStyle = 'rgb(' +
        _graph.graph.edges[i].color.r + ',' +
        _graph.graph.edges[i].color.g + ',' +
        _graph.graph.edges[i].color.b + ');';
      _this.context.stroke();
    }
    _this.context.strokeStyle = 'rgb(240,240,240);';
    _this.context.lineWidth = 4;
    _this.context.lineCap = 'round';
    for(var i=0; i<_graph.graph.vertices.length; i++) {
      var posx = _graph.graph.vertices[i].posx, posy = _graph.graph.vertices[i].posy;
      _this.context.beginPath();
      _this.context.arc(posx,posy,2,0,(2*Math.PI),false);
      _this.context.stroke();
    }
    _this.context.font = 'bold 10pt Verdana';
    _this.context.fillStyle = 'rgb(255,255,255)';
    _this.context.lineWidth = 1;
    for(var i=0; i<_graph.graph.edges.length; i++) {
      var posx = _graph.graph.edges[i].midpoint.x,
        posy = _graph.graph.edges[i].midpoint.y,
        slope = _graph.graph.edges[i].slope,
        str = _graph.graph.edges[i].weight;
      _this.context.beginPath();
      _this.context.moveTo(posx,posy);
      if(slope < 0) {
        _this.context.fillText(str,posx+10,posy+10);
        _this.context.lineTo(posx+10,posy+10);
      } else {
        _this.context.fillText(str,posx+10,posy-10);
        _this.context.lineTo(posx+10,posy-10);
      }
      _this.context.stroke();
    }
  };
  
  function _randgraph_gen() {
    // vertices
    for(var i=0; i<_graph.graph.n; i++) {
      var vertex = new _Vertex();
      vertex.id = i;
      vertex.posx = _rand(0,_this.canvas.width);
      vertex.posy = _rand(0,_this.canvas.height);
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
          var edge = new _EdgeWeighted();
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
    _this.title.innerHTML = '<h2>Complete Graph Generator (n = '+ _graph.graph.n +' vertices, random edge weight)</h2>';
    // UPGRAYEDD edge to weighted edge with a midpoint
    _EdgeWeighted.prototype = new _Edge();
  };
  
  function _randtree() {
    _randtree_init();
    _randtree_gen();
    _randtree_draw();
    //debug1
    console.log({}.constructor);
  };

  function _randtree_draw() {
    _this.context.strokeStyle = 'rgb(240,240,240);';
    _this.context.lineWidth = 4;
    _this.context.lineCap = 'round';
    for(var i=0; i<_graph.tree.nodes.length; i++) {
      var posx = _graph.tree.nodes[i].posx, posy = _graph.tree.nodes[i].posy;
      _this.context.beginPath();
      _this.context.arc(posx,posy,2,0,(2*Math.PI),false);
      _this.context.stroke();
    }
  };
  
  function _randtree_gen() {
    // determine height of n-ary tree
    for(var h=0; Math.pow(_graph.tree.a,h)<_graph.tree.n; h++) {
      _graph.tree.height = h;
    }
    _graph.tree.height++;
    // calculate basic tree metrics
    _graph.tree.heightTree = _this.canvas.height-20;
    _graph.tree.widthTree = _this.canvas.width-20;
    var nodesLeft = _graph.tree.n, posy = 10;
    for(var i=0; i<=_graph.tree.height; i++) {
      // calculate offset from x=0 to display child nodes for this level
      _graph.tree.widthNode = (_graph.tree.widthTree / (Math.pow(_graph.tree.a,i) + 1));
      var levelOffset = _graph.tree.widthTree - (_graph.tree.widthNode * Math.pow(_graph.tree.a,i));
      posy += Math.floor(_graph.tree.heightTree / (_graph.tree.height + 2));
      var posx = levelOffset;
      for(var j=0; j<Math.pow(_graph.tree.a,i) && nodesLeft>0; j++) {
        nodesLeft--;
        var node = new _Vertex();
        // fencepost our way to a correct node id
        node.id = _graph.tree.n - (nodesLeft + 1);
        node.level = i;
        node.levelNode = j;
        node.posx = Math.floor(posx + (j * _graph.tree.widthNode));
        node.posy = posy;
        // attach this node to its parent based on maf (and this node's parent to its kid)
        for(var k=0; k<_graph.tree.nodes.length; k++) {
          var parentNode = Math.floor(j/_graph.tree.a);
          var parentLevel = i-1;
          if((_graph.tree.nodes[k].level == parentLevel) && (_graph.tree.nodes[k].levelNode == parentNode)) {
            node.parent = _graph.tree.nodes[k];
            node.parent.children.push(node);
          }
        }
        //debug1
        console.log('node:id['+node.id+']px['+node.posx+']py['+node.posy+']');
        _graph.tree.nodes.push(node);
      }
    }
    // why don't you go ahead and come back some other time
    for(var l=0; l<_graph.tree.nodes.length; l++) {
      for(var m=0; m<_graph.tree.a; m++) {
        var posx = _graph.tree.nodes[l].children[m].posx;
        var posy = _graph.tree.nodes[l].children[m].posy;
      }
    }
  };
    
  function _randtree_init() {
    _this.title.innerHTML = '<h2>N-ary Tree Generator (n = '+ _graph.tree.n +' nodes, a = '+_graph.tree.a+')</h2>';
    // upgrade our vertices to tree nodes
    _Vertex.prototype.children = [];
    _Vertex.prototype.level = 0;
    _Vertex.prototype.levelNode = 0;
    _Vertex.prototype.parent = null;
  };
  
  //fix this functionality of "adding" vertices to the graph is actually by 
  //accident, since it draws the graph based on the vertices/edges arrays 
  //and not by the number n
  function _submit() {
    var ary = _this.doc.getElementById('input_ary'),
      graph = _this.doc.getElementById('input_graph'),
      tree = _this.doc.getElementById('input_tree'),
      vertices = _this.doc.getElementById('input_vertices');
    if(graph.checked == true) {
      _graph.type = 'graph';
      _graph.graph.n = vertices.value;
      _randgraph();
    } else if(tree.checked == true) {
      _graph.type = 'tree';
      _graph.tree.a = ary.value;
      _graph.tree.n = vertices.value;
      _randtree();
    }
  };
  
  function _submit_reset() {
    _this.context.clearRect(0,0,_this.canvas.width,_this.canvas.height);
    _graph.graph.n = 0;
    _graph.graph.vertices = [];
    _graph.graph.edges = [];
    _graph.tree.a = 0;
    _graph.tree.n = 0;
    _graph.tree.edges = [];
    _graph.tree.nodes = [];
    _submit();
  };

  return {
    event: event,
    init: init
  }
}());

// fire it up!
randGraph.event(window,'load',randGraph.init);
