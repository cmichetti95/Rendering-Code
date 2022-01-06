
///////////////////////////////////////////////////////////////////////
//
//     CSE 5542 AU 2021  LAB 2  
//     Connor Michetti
//
//     In this lab, I expand lab 1. Shapes can be drawn in the users
//     preferred color, and the most recently drawn shape can be 
//     manipulated in various ways (translated, scaled, rotated).
//
///////////////////////////////////////////////////////////////////////

var gl;  // the graphics context (gc) 
var shaderProgram;  // the shader program 

//viewport info 
var vp_minX, vp_maxX, vp_minY, vp_maxY, vp_width, vp_height; 

var VertexPositionBufferP;
var VertexPositionBufferL;
var VertexPositionBufferT;
var VertexPositionBufferS;
var VertexPositionBufferO;

var pointVertexColorBuffer;
var lineVertexColorBuffer;
var triangleVertexColorBuffer;
var squareVertexColorBuffer;
var objectVertexColorBuffer;

// shape size counter 
var point_size = 0;
var line_size = 0;
var tri_size = 0;
var sq_size = 0;
var ob_size = 0;

//need to be arrays of matrices
var point_matrix_array = [];
var line_matrix_array = [];
var triangle_matrix_array = [];
var square_matrix_array = [];
var object_matrix_array = [];


var colors = [];   // I am not doing colors, but you should :-) 

var polygon_mode = 'h';  //default = h line 
var color_mode  = 'r';

var mvMatrix = mat4.create();

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

    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    initScene();
    
    document.addEventListener('keydown', onKeyDown, false);
}

///////////////////////////////////////////////////////////
///////               Create VBO          /////////////////

////// There will be different buffer creations for point, lines, triangles, and rectangles ///////

function CreateBufferPoint(){
    var point_vertices = [
	0.0, 0.0, 0.0
];
    VertexPositionBufferP = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferP);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point_vertices), gl.STATIC_DRAW);
    VertexPositionBufferP.itemSize = 3; //NDC'S [x,y,0]
    VertexPositionBufferP.numItems = 1;
}

function CreateBufferLine() {
    var line_vertices = [
	-0.05, 0.0, 0.0,
	 0.05, 0.0, 0.0
];
    VertexPositionBufferL = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferL);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line_vertices), gl.STATIC_DRAW);
    VertexPositionBufferL.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferL.numItems = 2; 
}

function CreateBufferTriangle() {
    var tri_vertices = [
	0.0, 0.0, 0.0,
	0.05, 0.0, 0.0,
	0.0, 0.05, 0.0
];
    VertexPositionBufferT = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferT);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tri_vertices), gl.STATIC_DRAW);
    VertexPositionBufferT.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferT.numItems = 3;
}

function CreateBufferSquare() {
    var sq_vertices = [
	0.0, 0.0, 0.0,
	0.05, 0.0, 0.0,
	0.0, 0.05, 0.0,
	0.0, 0.05, 0.0,
	0.05, 0.0, 0.0,
	0.05, 0.05, 0.0
];
    VertexPositionBufferS = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferS);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sq_vertices), gl.STATIC_DRAW);
    VertexPositionBufferS.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferS.numItems = 6;
}

function CreateBufferObject() {
    var ob_vertices = [
	0.0, 0.0, 0.0,
	0.05, 0.0, 0.0,
	0.0, 0.1, 0.0,
	0.0, 0.1, 0.0,
	0.05, 0.0, 0.0,
	0.05, 0.1, 0.0,
	-0.025, 0.1, 0.0,
	0.025, 0.1, 0.0,
	0.025, 0.15, 0.0,
	0.025, 0.1, 0.0,
	0.075, 0.1, 0.0,
	0.025, 0.15, 0.0
];
    VertexPositionBufferO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(ob_vertices), gl.STATIC_DRAW);
    VertexPositionBufferO.itemSize = 3;  // NDC'S [x,y,0] 
    VertexPositionBufferO.numItems = 12;
}

///////////////////////////////////////////////////////

function setMatrixUniforms(mvMatrix){
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function degToRad(degrees){
	return degrees * Math.PI / 180;
}

///////////////////////////////////////////////////////

function draw_points() {  
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferP);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferP.itemSize, gl.FLOAT, false, 0, 0);

    for(var i = 0; i < point_size; i++){
	var mvMatrix = point_matrix_array[i];
	setMatrixUniforms(mvMatrix);
	gl.drawArrays(gl.POINTS, 0, VertexPositionBufferP.numItems);
    }
    console.log('got here');
}

function draw_lines() {  
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferL);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferL.itemSize, gl.FLOAT, false, 0, 0);

    for(var i = 0; i < line_size; i++){
	var mvMatrix = line_matrix_array[i];
	setMatrixUniforms(mvMatrix);
	gl.drawArrays(gl.LINES, 0, VertexPositionBufferL.numItems);
    }
}

function draw_triangles() {  
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferT);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferT.itemSize, gl.FLOAT, false, 0, 0);

    for(var i = 0; i < tri_size; i++){
	var mvMatrix = triangle_matrix_array[i];
	setMatrixUniforms(mvMatrix);
	gl.drawArrays(gl.TRIANGLES, 0, VertexPositionBufferT.numItems);
    }
}

function draw_squares() {   
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferS);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferS.itemSize, gl.FLOAT, false, 0, 0);
    
    for(var i = 0; i < sq_size; i++){
	var mvMatrix = square_matrix_array[i];
	setMatrixUniforms(mvMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, VertexPositionBufferS.numItems);
    }
}

function draw_objects() {  
    gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBufferO);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBufferO.itemSize, gl.FLOAT, false, 0, 0);

    for(var i = 0; i < ob_size; i++){
	var mvMatrix = object_matrix_array[i];
	setMatrixUniforms(mvMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, VertexPositionBufferO.numItems);
    }
}

///////////////////////////////////////////////////////////////////////

function initScene() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1; 
    console.log(vp_minX, vp_maxX, vp_minY, vp_maxY); 
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    CreateBufferPoint();
    CreateBufferLine();
    CreateBufferTriangle();
    CreateBufferSquare();
    CreateBufferObject();
}

function drawAll() {
    vp_minX = 0; vp_maxX = gl.canvasWidth;  vp_width = vp_maxX- vp_minX+1; 
    vp_minY = 0; vp_maxY = gl.canvasHeight; vp_height = vp_maxY-vp_minY+1;
    gl.viewport(vp_minX, vp_minY, vp_width, vp_height); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    if(point_size > 0) {
      draw_points();
    }
    if(line_size > 0) {
      draw_lines();
    }
    if(tri_size > 0) {
      draw_triangles();
    }
    if(sq_size > 0) {
      draw_squares();
    }
    if(ob_size > 0) {
      draw_objects();
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

		  var mvMatrixP = mat4.create();
		  mat4.identity(mvMatrixP);
		  mat4.translate(mvMatrixP, [0.0, 0.0, 0.0]);
		  point_matrix_array.push(mvMatrixP);

		  point_size++;
		  console.log('p pressed');
		  polygon_mode = 'p';

	      }
	      else {

		  var mvMatrixP = mat4.create();
		  mat4.identity(mvMatrixP);
		  mat4.translate(mvMatrixP, [0.0, 0.0, 0.0]);
		  point_matrix_array.push(mvMatrixP);

		  point_size++;
		  console.log('p pressed');
		  polygon_mode = 'p';	  

	      }
	  break;
         case 76:  //this is 'l' being pressed
              if (event.shiftKey) {

		  var mvMatrixL = mat4.create();
		  mat4.identity(mvMatrixL);
		  mat4.translate(mvMatrixL, [0.0, 0.0, 0.0]);
		  line_matrix_array.push(mvMatrixL);

		  line_size++;
		  console.log('l pressed');
		  polygon_mode = 'l';
	      }
	      else {

		  var mvMatrixL = mat4.create();
		  mat4.identity(mvMatrixL);
		  mat4.translate(mvMatrixL, [0.0, 0.0, 0.0]);
		  line_matrix_array.push(mvMatrixL);

		  line_size++;
		  console.log('l pressed');
		  polygon_mode = 'l';
	      }
          break;
	 case 84:  //this is 't' being pressed
	      if (event.shiftKey) {

		  var mvMatrixT = mat4.create();
		  mat4.identity(mvMatrixT);
		  mat4.translate(mvMatrixT, [0.0, 0.0, 0.0]);
		  triangle_matrix_array.push(mvMatrixT);

		  tri_size++;
		  console.log('t pressed');
		  polygon_mode = 't';
	      }
	      else {

		  var mvMatrixT = mat4.create();
		  mat4.identity(mvMatrixT);
		  mat4.translate(mvMatrixT, [0.0, 0.0, 0.0]);
		  triangle_matrix_array.push(mvMatrixT);

		  tri_size++;
		  console.log('t pressed');
		  polygon_mode = 't';
	      }
	  break;
	 case 81:  //this is 'q' being pressed
	      if (event.shiftKey) {
	  
		  var mvMatrixS = mat4.create();
		  mat4.identity(mvMatrixS);
		  mat4.translate(mvMatrixS, [0.0, 0.0, 0.0]);
		  square_matrix_array.push(mvMatrixS);

		  sq_size++;
		  console.log('q pressed');
		  polygon_mode = 's';
	      }
	      else {

		  var mvMatrixS = mat4.create();
		  mat4.identity(mvMatrixS);
		  mat4.translate(mvMatrixS, [0.0, 0.0, 0.0]);
		  square_matrix_array.push(mvMatrixS);

		  sq_size++;
		  console.log('q pressed');
		  polygon_mode = 's';
	      }
	  break;
	case 79:
	     if(event.shiftKey){

		  var mvMatrixO = mat4.create();
		  mat4.identity(mvMatrixO);
		  mat4.translate(mvMatrixO, [0.0, 0.0, 0.0]);
		  object_matrix_array.push(mvMatrixO);

		  ob_size++;
		  console.log('o pressed');
		  polygon_mode = 'o';
	     }
	     else {

		  var mvMatrixO = mat4.create();
		  mat4.identity(mvMatrixO);
		  mat4.translate(mvMatrixO, [0.0, 0.0, 0.0]);
		  object_matrix_array.push(mvMatrixO);

		  ob_size++;
		  console.log('o pressed');
		  polygon_mode = 'o';
	     }
	  break;

	case 87: //w pressed

		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, 0.025, 0]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, 0.025, 0]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, 0.025, 0]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, 0.025, 0]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, 0.025, 0]);
		    object_matrix_array.push(mvMatrix);
		}
	break;

	case 65: //a pressed

		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [-0.025, 0, 0]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [-0.025, 0, 0]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [-0.025, 0, 0]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [-0.025, 0, 0]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [-0.025, 0, 0]);
		    object_matrix_array.push(mvMatrix);
		}
	break;

	case 83: //s pressed

		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, -0.025, 0]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, -0.025, 0]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, -0.025, 0]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, -0.025, 0]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0, -0.025, 0]);
		    object_matrix_array.push(mvMatrix);
		}
	break;

	case 68: //d pressed

		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0.025, 0, 0]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0.025, 0, 0]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0.025, 0, 0]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0.025, 0, 0]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.translate(mvMatrix, [0.025, 0, 0]);
		    object_matrix_array.push(mvMatrix);
		}
	break;

	case 82: //r pressed

	if(event.shiftKey){
		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.rotate(mvMatrix, degToRad(10), [0, 0, 1]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.rotate(mvMatrix, degToRad(10), [0, 0, 1]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.rotate(mvMatrix, degToRad(10), [0, 0, 1]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.rotate(mvMatrix, degToRad(10), [0, 0, 1]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.rotate(mvMatrix, degToRad(10), [0, 0, 1]);
		    object_matrix_array.push(mvMatrix);
		}
	}
	else{
		color_mode = 'r';
	}
	break;

	case 69: //e pressed

	if(event.shiftKey){
		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [1.1, 1.1, 1.0]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [1.1, 1.1, 1.0]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [1.1, 1.1, 1.0]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [1.1, 1.1, 1.0]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [1.1, 1.1, 1.0]);
		    object_matrix_array.push(mvMatrix);
		}
	}
	else{
		if(polygon_mode == 'p'){
		    var mvMatrix = point_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [0.9, 0.9, 1.0]);
		    point_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'l'){
		    var mvMatrix = line_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [0.9, 0.9, 1.0]);
		    line_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 't'){
		    var mvMatrix = triangle_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [0.9, 0.9, 1.0]);
		    triangle_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 's'){
		    var mvMatrix = square_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [0.9, 0.9, 1.0]);
		    square_matrix_array.push(mvMatrix);
		}
		else if(polygon_mode == 'o'){
		    var mvMatrix = object_matrix_array.pop();
		    mvMatrix = mat4.scale(mvMatrix, [0.9, 0.9, 1.0]);
		    object_matrix_array.push(mvMatrix);
		}
	}
	break;

	case 66: //b was pressed
		color_mode = 'b';
	break;

	case 71: //g was pressed
		color_mode = 'g';
	break;

	case 67:
	     point_size = 0;
	     line_size = 0;
	     tri_size = 0;
	     sq_size = 0;
	     ob_size = 0;

	     point_matrix_array.length = 0;
	     line_matrix_array.length = 0;
	     triangle_matrix_array.length = 0;
	     square_matrix_array.length = 0;
	     object_matrix_array.length = 0;
      }
    drawAll();	
    }
