

///////////////////////////////////////////////////////////////////////
//
//     CSE 5542 AU 2021  LAB 1  
//     Connor Michetti
//
//     In this lab, I draw a shape based on the user input.
//
///////////////////////////////////////////////////////////////////////

var gl;  // the graphics context (gc) 
var shaderProgram;  // the shader program 

//viewport info 
var vp_minX, vp_maxX, vp_minY, vp_maxY, vp_width, vp_height; 

var VertexPositionBuffer;

var VertexPositionBufferP;
var VertexPositionBufferL;
var VertexPositionBufferT;
var VertexPositionBufferS;

var shape_size = 0;     // shape size counter 
var point_size = 0;
var line_size = 0;
var tri_size = 0;
var sq_size = 0;


var vbo_vertices = [];  // i only store line vertices, 2 points per click 

var vbo_verticesP = [];
var vbo_verticesL = [];
var vbo_verticesT = [];
var vbo_verticesS = [];


var colors = [];   // I am not doing colors, but you should :-) 
var shapes = [];   // the array to store what shapes are in the list 

var polygon_mode = 'h';  //default = h line 
var color_mode  = 'r';

//////////// Init OpenGL Context etc. ///////////////

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.canvasWidth = canvas.width;
        gl.canvasHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

///////////////////////////////////////////////////////////////

function webGLStart() {
    var canvas = document.getElementById("lab1-canvas");
    initGL(canvas);
    initShaders();
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    initScene();
    
    document.addEventListener('keydown', onKeyDown, false);
}

///////////////////////////////////////////////////////////
///////               Create VBO          /////////////////

////// There will be different buffer creations for point, lines, triangles, and rectangles ///////

function CreateBufferPoint(){
    VertexPositionBufferP = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferP);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbo_verticesP), gl.STATIC_DRAW);
    VertexPositionBufferP.itemSize = 3; //NDC'S [x,y,0]
    VertexPositionBufferP.numItems = point_size;  //this is for points, so I simply do 1
}

function CreateBufferLine() {
    VertexPositionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbo_verticesL), gl.STATIC_DRAW);
    VertexPositionBufferL.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferL.numItems = line_size* 2;// this is to draw lines, so n*2 vertices 
}

function CreateBufferTriangle() {
    VertexPositionBufferT = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferT);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbo_verticesT), gl.STATIC_DRAW);
    VertexPositionBufferT.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferT.numItems = tri_size * 3;// this is for triangles so we'll want 1 triangles with 3 vertices per triangle so 3 * size
}

function CreateBufferSquare() {
    VertexPositionBufferS = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferS);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vbo_verticesS), gl.STATIC_DRAW);
    VertexPositionBufferS.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferS.numItems = sq_size * 6;// this is for squares so we'll want 2 triangles with 3 vertices per triangle so 6 * size
}

///////////////////////////////////////////////////////
function draw_lines() {   // lab1 sample - draw lines only 
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferL);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferL.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES, 0, VertexPositionBufferL.numItems);
}

function draw_points() {   // lab1 sample - draw lines only 
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferP);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferP.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.POINTS, 0, VertexPositionBufferP.numItems);
}

function draw_triangles() {   // lab1 sample - draw lines only 
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferT);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferT.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, VertexPositionBufferT.numItems);
}

function draw_squares() {   // lab1 sample - draw lines only 
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferS);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferS.itemSize, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, VertexPositionBufferS.numItems);
}

///////////////////////////////////////////////////////////////////////

function initScene() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function drawScene() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw_lines();
    }

function drawScenePoint() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw_points();
    }

function drawSceneLine() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw_lines();
    }

function drawSceneTriangles() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw_triangles();
    }

function drawSceneSquares() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    draw_squares();
    }

function drawAll() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1;
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    if(vbo_verticesP.length > 0) {
      draw_points();
    }
    if(vbo_verticesL.length > 0) {
      draw_lines();
    }
    if(vbo_verticesT.length > 0) {
      draw_triangles();
    }
    if(vbo_verticesS.length > 0) {
      draw_squares();
    }
    }

///////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
//
//  key stroke handler 
//
    function onKeyDown(event) {
      console.log(event.keyCode);
      switch(event.keyCode)  {
	 case 80:  //this is 'p' being pressed
	      if (event.shiftKey) {
		  var startX = Math.random() * (1 - (-1)) + (-1);
		  var startY = Math.random() * (1 - (-1)) + (-1);
		  vbo_verticesP.push(startX);  //x
		  vbo_verticesP.push(startY);  //y
		  vbo_verticesP.push(0.0);  //z
		  point_size++;
		  CreateBufferPoint();
		  drawAll();
		  console.log('p pressed');
	      }
	      else {
		  var startX = Math.random() * (1 - (-1)) + (-1);
		  var startY = Math.random() * (1 - (-1)) + (-1);
		  vbo_verticesP.push(startX);  //x
		  vbo_verticesP.push(startY);  //y
		  vbo_verticesP.push(0.0);
		  point_size++;
		  CreateBufferPoint();
		  drawAll();
		  console.log('p pressed');
	      }
	  break;
         case 72:  //this is 'h' being pressed
              if (event.shiftKey) {
		  var startPosX = Math.random()* (1 - (-1)) + (-1);
		  var startPosY = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesL.push(startPosX - 0.1);
		  vbo_verticesL.push(startPosY);
		  vbo_verticesL.push(0.0);

		  vbo_verticesL.push(startPosX + 0.05);
		  vbo_verticesL.push(startPosY);
		  vbo_verticesL.push(0.0);

		  line_size++;
		  CreateBufferLine();
		  drawAll();
		  console.log('h pressed');
	      }
	      else {
		  var startPosX = Math.random()* (1 - (-1)) + (-1);
		  var startPosY = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesL.push(startPosX - 0.1);
		  vbo_verticesL.push(startPosY);
		  vbo_verticesL.push(0.0);

		  vbo_verticesL.push(startPosX + 0.05);
		  vbo_verticesL.push(startPosY);
		  vbo_verticesL.push(0.0);

		  line_size++;
		  CreateBufferLine();
		  drawAll();
		  console.log('h pressed');
	      }
          break;
         case 86:  //this is 'v' being pressed
              if (event.shiftKey) {
		  var startPosX = Math.random()* (1 - (-1)) + (-1);
		  var startPosY = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesL.push(startPosX);
		  vbo_verticesL.push(startPosY - 0.1);
		  vbo_verticesL.push(0.0);

		  vbo_verticesL.push(startPosX);
		  vbo_verticesL.push(startPosY + 0.05);
		  vbo_verticesL.push(0.0);

		  line_size++;
		  CreateBufferLine();
		  drawAll();
		  console.log('v pressed');
	      }
	      else {
		  var startPosX = Math.random()* (1 - (-1)) + (-1);
		  var startPosY = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesL.push(startPosX);
		  vbo_verticesL.push(startPosY - 0.1);
		  vbo_verticesL.push(0.0);

		  vbo_verticesL.push(startPosX);
		  vbo_verticesL.push(startPosY + 0.05);
		  vbo_verticesL.push(0.0);

		  line_size++;
		  CreateBufferLine();
		  drawAll();
		  console.log('v pressed');
	      }
          break;
	 case 84:  //this is 't' being pressed
	      if (event.shiftKey) {

		  var startTri = Math.random()* (1 - (-1)) + (-1);
		  var startTri = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesT.push(startXTri);  //first vertex
		  vbo_verticesT.push(startYTri);
		  vbo_verticesT.push(0.0);

		  vbo_verticesT.push(startXTri + 0.1);  //second vertex
		  vbo_verticesT.push(startYTri);
		  vbo_verticesT.push(0.0);

		  vbo_verticesT.push(startXTri);
		  vbo_verticesT.push(startYTri + 0.1);
		  vbo_verticesT.push(0.0);

		  tri_size++;
		  CreateBufferTriangle();
		  drawAll();
		  console.log('t pressed');
	      }
	      else {
		  var startXTri = Math.random()* (1 - (-1)) + (-1);
		  var startYTri = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesT.push(startXTri);  //first vertex
		  vbo_verticesT.push(startYTri);
		  vbo_verticesT.push(0.0);

		  vbo_verticesT.push(startXTri + 0.1);  //second vertex
		  vbo_verticesT.push(startYTri);
		  vbo_verticesT.push(0.0);

		  vbo_verticesT.push(startXTri);
		  vbo_verticesT.push(startYTri + 0.1);
		  vbo_verticesT.push(0.0);

		  tri_size++;
		  CreateBufferTriangle();
		  drawAll();
		  console.log('t pressed');
	      }
	  break;
	 case 81:  //this is 'q' being pressed
	      if (event.shiftKey) {

		  startSqX = Math.random()* (1 - (-1)) + (-1);
		  startSqY = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesS.push(startSqX);
		  vbo_verticesS.push(startSqY);
		  vbo_verticesS.push(0.0);


		  vbo_verticesS.push(startSqX + 0.1);
		  vbo_verticesS.push(startSqY);
		  vbo_verticesS.push(0.0);


		  vbo_verticesS.push(startSqX);
		  vbo_verticesS.push(startSqY + 0.1);
		  vbo_verticesS.push(0.0);


		  vbo_verticesS.push(startSqX + 0.1);
		  vbo_verticesS.push(startSqY + 0.1);
		  vbo_verticesS.push(0.0);
	  
		  sq_size++;
		  CreateBufferSquare();
		  drawAll();
		  console.log('q pressed');
	      }
	      else {
		  startSqX = Math.random()* (1 - (-1)) + (-1);
		  startSqY = Math.random()* (1 - (-1)) + (-1);

		  vbo_verticesS.push(startSqX);
		  vbo_verticesS.push(startSqY);
		  vbo_verticesS.push(0.0);

		  vbo_verticesS.push(startSqX + 0.1);
		  vbo_verticesS.push(startSqY);
		  vbo_verticesS.push(0.0);

		  vbo_verticesS.push(startSqX + 0.1);
		  vbo_verticesS.push(startSqY + 0.1);
		  vbo_verticesS.push(0.0);

		  vbo_verticesS.push(startSqX);
		  vbo_verticesS.push(startSqY);
		  vbo_verticesS.push(0.0);

		  vbo_verticesS.push(startSqX + 0.1);
		  vbo_verticesS.push(startSqY + 0.1);
		  vbo_verticesS.push(0.0);

		  vbo_verticesS.push(startSqX);
		  vbo_verticesS.push(startSqY + 0.1);
		  vbo_verticesS.push(0.0);

		  sq_size++;
		  CreateBufferSquare();
		  drawAll();
		  console.log('q pressed');
	      }
	  break;
	case 67:
	     vbo_verticesP.length = 0;
	     vbo_verticesL.length = 0;
	     vbo_verticesT.length = 0;
	     vbo_verticesS.length = 0;

	     point_size = 0;
	     line_size = 0;
	     tri_size = 0;
	     sq_size = 0;
      }
    drawAll();	
    }
