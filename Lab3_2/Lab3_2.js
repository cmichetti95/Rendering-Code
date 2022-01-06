//////////////////////////////////////////////////////////////////
//
//  Lab 03_2
//  
//
//  Connor Michetti
//

var gl;
var shaderProgram;
var draw_type=2; 

//////////// Init OpenGL Context etc. ///////////////

    function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }

    ///////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

    var squareVertexPositionBuffer;
    var squareVertexColorBuffer;
    var squareVertexIndexBuffer; 

   ////////////////    Initialize VBO  ////////////////////////

    var squareVertexPositionBuffer;
    var squareVertexColorBuffer;
    var squareVertexIndexBuffer;

    var sqvertices = [];
    var sqindices = [];
    var sqcolors = [];

function initSquare()
{
        sqvertices = [
             0.5,  0.5,  -.5,
	    -0.5,  0.5,  -.5, 
	    - 0.5, -0.5,  -.5,
 	    0.5, -0.5,  -.5,
             0.5,  0.5,  .5,
	    -0.5,  0.5,  .5, 
            -0.5, -0.5,  .5,
	     0.5, -0.5,  .5,	    
	    
        ];
	sqindices = [0,1,2, 0,2,3, 0,3,7, 0, 7,4, 6,2,3,6,3,7,5,1,2, 5,2,6,5,1,0,5,0,4,5,6,7,5,7,4];
        sqcolors = [
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,	    
        ];    
}


function initSQBuffers() {

        initSquare(); 
        squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqvertices), gl.STATIC_DRAW);
        squareVertexPositionBuffer.itemSize = 3;
        squareVertexPositionBuffer.numItems = 8;

	squareVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sqindices), gl.STATIC_DRAW);  
        squareVertexIndexBuffer.itemsize = 1;
        squareVertexIndexBuffer.numItems = 36;  

        squareVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sqcolors), gl.STATIC_DRAW);
        squareVertexColorBuffer.itemSize = 3;
        squareVertexColorBuffer.numItems = 8;

}


// TETRA //

	var tetraVertexPositionBuffer;
	var tetraVertexColorBuffer;
	var tetraVertexIndexBuffer; 

	var thvertices = [];
	var thcolors = []; 
	var thindicies = [];

    function initTetra(){
	
	thvertices = [
	   -0.5, 0, 0,
	    0.5, 0, 0,
	    0, 0, -0.5,
	    0, 0.5, -0.25
	];

    	thindices = [0, 1, 2, 0, 1, 3 ,1 ,2, 3, 0, 2, 3];

        thcolors = [
	    1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,	    
        ];
    }

function initTHBuffers() {

        initTetra();
        tetraVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tetraVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thvertices), gl.STATIC_DRAW);
        tetraVertexPositionBuffer.itemSize = 3;
        tetraVertexPositionBuffer.numItems = 4;

	tetraVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetraVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(thindices), gl.STATIC_DRAW);  
        tetraVertexIndexBuffer.itemsize = 1;
        tetraVertexIndexBuffer.numItems = 12;  

        tetraVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tetraVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(thcolors), gl.STATIC_DRAW);
        tetraVertexColorBuffer.itemSize = 3;
        tetraVertexColorBuffer.numItems = 4;
}

// CYLINDER //

	var cylinderVertexPositionBuffer;
	var cylinderVertexNormalBuffer;
	var cylinderVertexColorBuffer;
	var cylinderVertexIndexBuffer; 

	var cyverts = [];
	var cynormals = []; 
	var cycolors = []; 
	var cyindicies = [];

function initCylinder(nslices, nstacks,  r,  g,  b) 
{
  var nvertices = nslices * nstacks;
    
  var Dangle = 2*Math.PI/(nslices-1); 

  for (j =0; j<nstacks; j++)
    for (i=0; i<nslices; i++) {
      var idx = j*nslices + i; // mesh[j][i] 
      var angle = Dangle * i; 
      cyverts.push(Math.cos(angle)); 
      cyverts.push(Math.sin(angle)); 
      cyverts.push(j*3.0/(nstacks-1)-1.5);

      cynormals.push(Math.cos(angle)); 
      cynormals.push(Math.sin(angle));
      cynormals.push(0.0); 

      cycolors.push(Math.cos(angle)); 
      cycolors.push(Math.sin(angle)); 
      cycolors.push(j*1.0/(nstacks-1));	
      cycolors.push(1.0); 
    }
  // now create the index array 

  nindices = (nstacks-1)*6*(nslices+1); 

  for (j =0; j<nstacks-1; j++)
    for (i=0; i<=nslices; i++) {
      var mi = i % nslices;
      var mi2 = (i+1) % nslices;
      var idx = (j+1) * nslices + mi;	
      var idx2 = j*nslices + mi; // mesh[j][mi] 
      var idx3 = (j) * nslices + mi2;
      var idx4 = (j+1) * nslices + mi;
      var idx5 = (j) * nslices + mi2;
      var idx6 = (j+1) * nslices + mi2;
	
      cyindicies.push(idx); 
      cyindicies.push(idx2);
      cyindicies.push(idx3); 
      cyindicies.push(idx4);
      cyindicies.push(idx5); 
      cyindicies.push(idx6);
    }
}


function initCYBuffers() {

        var nslices = 10;
        var nstacks = 50; 
        initCylinder(nslices,nstacks,1.0,1.0,0.0);
    
        cylinderVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cyverts), gl.STATIC_DRAW);
        cylinderVertexPositionBuffer.itemSize = 3;
        cylinderVertexPositionBuffer.numItems = nslices * nstacks;

        cylinderVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cynormals), gl.STATIC_DRAW);
        cylinderVertexNormalBuffer.itemSize = 3;
        cylinderVertexNormalBuffer.numItems = nslices * nstacks;    

	cylinderVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cyindicies), gl.STATIC_DRAW);  
        cylinderVertexIndexBuffer.itemsize = 1;
        cylinderVertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);

        cylinderVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cycolors), gl.STATIC_DRAW);
        cylinderVertexColorBuffer.itemSize = 4;
        cylinderVertexColorBuffer.numItems = nslices * nstacks;

}

// CONE //

	var coneVertexPositionBuffer;
	var coneVertexNormalBuffer;
	var coneVertexColorBuffer;
	var coneVertexIndexBuffer; 

	var cnverts = [];
	var cnnormals = []; 
	var cncolors = []; 
	var cnindicies = [];

function initCone(nslices, nstacks,  r,  g,  b) 
{
  	var nvertices = nslices * nstacks;
    
 	 var Dangle = 2*Math.PI/(nslices-1); 

  	for (j =0; j<nstacks; j++)
    	    for (i=0; i<nslices; i++) {
    		var idx = j*nslices + i; // mesh[j][i] 
     		var angle = Dangle * i; 
    		cnverts.push(Math.cos(angle) * (49 - j) / 49); 
     		cnverts.push(Math.sin(angle) * (49 - j) / 49); 
    		cnverts.push(j*3.0/(nstacks-1)-1.5);

      		cnnormals.push(Math.cos(angle)); 
      		cnnormals.push(Math.sin(angle));
      		cnnormals.push(0.0); 

      		cncolors.push(Math.cos(angle)); 
      		cncolors.push(Math.sin(angle)); 
      		cncolors.push(j*1.0/(nstacks-1));	
      		cncolors.push(1.0); 
	}
  // now create the index array 

  nindices = (nstacks-1)*6*(nslices+1); 

  for (j =0; j<nstacks-1; j++)
    for (i=0; i<=nslices; i++) {
      var mi = i % nslices;
      var mi2 = (i+1) % nslices;
      var idx = (j+1) * nslices + mi;	
      var idx2 = j*nslices + mi; // mesh[j][mi] 
      var idx3 = (j) * nslices + mi2;
      var idx4 = (j+1) * nslices + mi;
      var idx5 = (j) * nslices + mi2;
      var idx6 = (j+1) * nslices + mi2;
	
      cnindicies.push(idx); 
      cnindicies.push(idx2);
      cnindicies.push(idx3); 
      cnindicies.push(idx4);
      cnindicies.push(idx5); 
      cnindicies.push(idx6);
    }
}


function initCNBuffers() {

        var nslices = 10;
        var nstacks = 50; 
        initCone(nslices,nstacks,1.0,1.0,0.0);
    
        coneVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cnverts), gl.STATIC_DRAW);
        coneVertexPositionBuffer.itemSize = 3;
        coneVertexPositionBuffer.numItems = nslices * nstacks;

        coneVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cnnormals), gl.STATIC_DRAW);
        coneVertexNormalBuffer.itemSize = 3;
        coneVertexNormalBuffer.numItems = nslices * nstacks;    

	coneVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cnindicies), gl.STATIC_DRAW);  
        coneVertexIndexBuffer.itemsize = 1;
        coneVertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);

        coneVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cncolors), gl.STATIC_DRAW);
        coneVertexColorBuffer.itemSize = 4;
        coneVertexColorBuffer.numItems = nslices * nstacks;

}


// SPHERE //

	var sphereVertexPositionBuffer;
	var sphereVertexNormalBuffer;
	var sphereVertexColorBuffer;
	var sphereVertexIndexBuffer; 

	var spverts = [];
	var spnormals = []; 
	var spcolors = []; 
	var spindicies = [];

function initSphere(nslices, nstacks,  r,  g,  b) 
{
  	var nvertices = nslices * nstacks;

	//need vars for angles which can be calculated via long/latitude

	var phiCut = 2*Math.PI/(nstacks - 1);
	var theCut = 2*Math.PI/(nslices - 1);

  	for (j =0; j<nstacks; j++)
    	    for (i=0; i<nslices; i++) {
    		var idx = j*nslices + i; // mesh[j][i] 

		//instead of angle, we need theta and phi, which can be calculated with the indices
		var phi = phiCut * j;	//phi and theta
		var the = theCut * i;

		//this is with radius = 1
    		spverts.push(Math.cos(phi) * Math.sin(the));  //these should be based off a formula from wikipedia. First x
     		spverts.push(Math.sin(phi) * Math.sin(the)); //y
    		spverts.push(Math.cos(the)); //z

      		spnormals.push(Math.cos(phi) * Math.sin(the)); 
      		spnormals.push(Math.sin(phi) * Math.sin(the));
      		spnormals.push(0.0); 

      		spcolors.push(Math.cos(phi) * Math.sin(the)); 
      		spcolors.push(Math.sin(phi) * Math.sin(the)); 
      		spcolors.push(1.0/(nstacks-1));	
      		spcolors.push(1.0); 
	}
  // now create the index array 

  nindices = (nstacks-1)*6*(nslices+1); 

  for (j =0; j<nstacks-1; j++)
    for (i=0; i<=nslices; i++) {
      var mi = i % nslices;
      var mi2 = (i+1) % nslices;
      var idx = (j+1) * nslices + mi;	
      var idx2 = j*nslices + mi; // mesh[j][mi] 
      var idx3 = (j) * nslices + mi2;
      var idx4 = (j+1) * nslices + mi;
      var idx5 = (j) * nslices + mi2;
      var idx6 = (j+1) * nslices + mi2;
	
      spindicies.push(idx); 
      spindicies.push(idx2);
      spindicies.push(idx3); 
      spindicies.push(idx4);
      spindicies.push(idx5); 
      spindicies.push(idx6);
    }
}


function initSPBuffers() {

        var nslices = 10;
        var nstacks = 50; 
        initSphere(nslices,nstacks,1.0,1.0,0.0);
    
        sphereVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spverts), gl.STATIC_DRAW);
        sphereVertexPositionBuffer.itemSize = 3;
        sphereVertexPositionBuffer.numItems = nslices * nstacks;

        sphereVertexNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spnormals), gl.STATIC_DRAW);
        sphereVertexNormalBuffer.itemSize = 3;
        sphereVertexNormalBuffer.numItems = nslices * nstacks;    

	sphereVertexIndexBuffer = gl.createBuffer();	
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer); 
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spindicies), gl.STATIC_DRAW);  
        sphereVertexIndexBuffer.itemsize = 1;
        sphereVertexIndexBuffer.numItems = (nstacks-1)*6*(nslices+1);

        sphereVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spcolors), gl.STATIC_DRAW);
        sphereVertexColorBuffer.itemSize = 4;
        sphereVertexColorBuffer.numItems = nslices * nstacks;

}

    ///////////////////////////////////////////////////////////////
	//section should be good//
    ///////////////////////////////////////////////////////////////

    var mMatrix = mat4.create();  // model matrix
    var vMatrix = mat4.create(); // view matrix
    var pMatrix = mat4.create();  // projection matrix 
    var mvMatrix = mat4.create();  // modelview matrix
    var pos = [0, 0, 5];  // we'll update this when the camera moves
    var coi = [0, 0, -1];  // we'll update this when the camera rotates
    var up = [0, 1, 0];

    mat4.identity(mMatrix);
    mat4.identity(vMatrix);


    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, vMatrix);	
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

    }

     function degToRad(degrees) {
        return degrees * Math.PI / 180;
     }

    ///////////////////////////////////////////////////////////////
	//camera is set up in initScene//


// DRAW CUBE //

    function drawCube(tempMatrix, color, drawAxis) {

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, tempMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,squareVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, squareVertexIndexBuffer); 

        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type == 1) gl.drawArrays(gl.LINE_LOOP, 0, squareVertexPositionBuffer.numItems);	
        else if (draw_type == 0) gl.drawArrays(gl.POINTS, 0, squareVertexPositionBuffer.numItems);
	else if (draw_type== 2) gl.drawElements(gl.TRIANGLES, squareVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0); 
}

// DRAW TETRA //

    function drawTetra(tempMatrix, color, drawAxis) {

        gl.bindBuffer(gl.ARRAY_BUFFER, tetraVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tetraVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, tempMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, tetraVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,tetraVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tetraVertexIndexBuffer); 

        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type == 1) gl.drawArrays(gl.LINE_LOOP, 0, tetraVertexPositionBuffer.numItems);	
        else if (draw_type == 0) gl.drawArrays(gl.POINTS, 0, tetraVertexPositionBuffer.numItems);
	else if (draw_type== 2) gl.drawElements(gl.TRIANGLES, tetraVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0); 
}

// DRAW CYLINDER //

    function drawCyl(tempMatrix, color, drawAxis) {

        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, tempMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute,cylinderVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderVertexIndexBuffer); 

        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type == 1) gl.drawArrays(gl.LINE_LOOP, 0, cylinderVertexPositionBuffer.numItems);	
        else if (draw_type == 0) gl.drawArrays(gl.POINTS, 0, cylinderVertexPositionBuffer.numItems);
	else if (draw_type== 2) gl.drawElements(gl.TRIANGLES, cylinderVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0); 
}

// DRAW CONE //

    function drawCone(tempMatrix, color, drawAxis) {

        gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, coneVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, tempMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, coneVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer); 

        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type == 1) gl.drawArrays(gl.LINE_LOOP, 0, coneVertexPositionBuffer.numItems);	
        else if (draw_type == 0) gl.drawArrays(gl.POINTS, 0, coneVertexPositionBuffer.numItems);
	else if (draw_type== 2) gl.drawElements(gl.TRIANGLES, coneVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0); 
}

// DRAW SPHERE //

    function drawSphere(tempMatrix, color, drawAxis) {

        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, tempMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	// draw elementary arrays - triangle indices 
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer); 

        setMatrixUniforms();   // pass the modelview mattrix and projection matrix to the shader 

	if (draw_type == 1) gl.drawArrays(gl.LINE_LOOP, 0, sphereVertexPositionBuffer.numItems);	
        else if (draw_type == 0) gl.drawArrays(gl.POINTS, 0, sphereVertexPositionBuffer.numItems);
	else if (draw_type== 2) gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems , gl.UNSIGNED_SHORT, 0); 
}

	var xrotation = 0;
	var yrotation = 0;
	var zrotation = 0;

    function drawScene() {

        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var matrixStack = [];
	color = [0, 1, 0, 1]

	mat4.perspective(60, 1.0, 0.1, 100, pMatrix);  // set up the projection matrix 
	
	mat4.identity(vMatrix);
        vMatrix = mat4.lookAt(pos, coi, up, vMatrix);	// set up the view matrix

	mat4.identity(mMatrix);	
	mMatrix = mat4.rotate(mMatrix, degToRad(xrotation), [1, 0, 0]);
	mMatrix = mat4.rotate(mMatrix, degToRad(yrotation), [0, 1, 0]);
	mMatrix = mat4.rotate(mMatrix, degToRad(zrotation), [0, 0, 1]);


        mat4.multiply(vMatrix, mMatrix, mvMatrix);  // set up the model view matrix

	drawCube(mMatrix, color, drawAxis);

	mMatrix = mat4.translate(mMatrix, [0, 0, 0.75]);
	mMatrix = mat4.scale(mMatrix, [0.5, 0.5, 0.25]);
	mat4.multiply(vMatrix, mMatrix, mvMatrix);
	drawCyl(mMatrix, color, drawAxis);

	mMatrix = mat4.translate(mMatrix, [ 0, 0, 2.25]);
	mMatrix = mat4.scale(mMatrix, [1.1, 1.1, 0.5]);
	mMatrix = mat4.rotate(mMatrix, degToRad(coneRotZ), [0, 0, 1]);
	mat4.multiply(vMatrix, mMatrix, mvMatrix);
	pushMatrix(matrixStack, mMatrix);
	drawCone(mMatrix, color, drawAxis);

	popMatrix(matrixStack);
	mMatrix = mat4.translate(mMatrix, [1.4, 0, -10.5]);
	mMatrix = mat4.scale(mMatrix, [0.5, 0.5, 2]);
	mat4.multiply(vMatrix, mMatrix, mvMatrix);
	drawSphere(mMatrix, color, drawAxis);

	mMatrix = mat4.translate(mMatrix, [-3.25, 0, -2]);
	mMatrix = mat4.scale(mMatrix, [4, 4, 4]);
	mMatrix = mat4.rotate(mMatrix, degToRad(tetraRotX), [1, 0, 0]);
	mMatrix = mat4.rotate(mMatrix, degToRad(tetraRotY), [0, 1, 0]);
	mMatrix = mat4.rotate(mMatrix, degToRad(tetraRotZ), [0, 0, 1]);
	mat4.multiply(vMatrix, mMatrix, mvMatrix);
	drawTetra(mMatrix, color, drawAxis);

    }



     //////////////////////////////////////////////////////////////
     function pushMatrix(stack, m) {
      var copy = mat4.create(m);  //necessary because javascript only does shallow push 
      stack.push(copy); 
     }

     function popMatrix(stack) {
         return(stack.pop()); 
     }
    
     ///////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////

//function webGLStart() {
        //var canvas = document.getElementById("code03-canvas");
       // initGL(canvas);
       //initShaders();

	//gl.enable(gl.DEPTH_TEST); 

        //shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
       // gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        //shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
        //gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	
        //shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        //gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
	
       // shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
       // shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	//shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	//shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");	

        //shaderProgram.light_posUniform = gl.getUniformLocation(shaderProgram, "light_pos");
        //shaderProgram.ambient_coefUniform = gl.getUniformLocation(shaderProgram, "ambient_coef");	
        //shaderProgram.diffuse_coefUniform = gl.getUniformLocation(shaderProgram, "diffuse_coef");
        //shaderProgram.specular_coefUniform = gl.getUniformLocation(shaderProgram, "specular_coef");
        //shaderProgram.shininess_coefUniform = gl.getUniformLocation(shaderProgram, "mat_shininess");

        //shaderProgram.light_ambientUniform = gl.getUniformLocation(shaderProgram, "light_ambient");	
        //shaderProgram.light_diffuseUniform = gl.getUniformLocation(shaderProgram, "light_diffuse");
        //shaderProgram.light_specularUniform = gl.getUniformLocation(shaderProgram, "light_specular");	


        //initSQBuffers();
	//initTHBuffers();
	//initCYBuffers(); 
	//initCNBuffers();
	//initSPBuffers();

       // gl.clearColor(0.0, 0.0, 0.0, 1.0);
        //console.log('start! ');
       // console.error('I hope no error ....');


      // document.addEventListener('keydown', onKeyDown, false);

       //drawScene();
    //}

    function webGLStart() {
        var canvas = document.getElementById("code03-canvas");
        initGL(canvas);
        initShaders();

	gl.enable(gl.DEPTH_TEST); 

  
        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	

        initSQBuffers();
	initTHBuffers();
	initCYBuffers(); 
	initCNBuffers();
	initSPBuffers();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        document.addEventListener('keydown', onKeyDown, false);

        drawScene();
    }

function BG(red, green, blue) {

    gl.clearColor(red, green, blue, 1.0);
    drawScene(); 

} 

function redraw() {
    Z_angle = 0; 
    drawScene();
}
    

function geometry(type) {

    draw_type = type;
    drawScene();

} 

var drawAxis = false; 

function draw_axis(){
   drawAxis = !drawAxis; 
   drawScene(); 
}

///////////////////////////////////////////////////////////////////////////
//
//  key stroke handler 
//
///////////////////////////////////////////////////////////////////////////

	var tetraRotX = 0;
	var tetraRotY = 0;
	var tetraRotZ = 0;

	var coneRotZ = 0;

    function onKeyDown(event) {
      console.log(event.keyCode);
      switch(event.keyCode)  {

         case 82:  //this looks up/down. 'R' for up 'r' for down.
              if (event.shiftKey) {
                  console.log('enter R');

			coi[1] += .05;

              }
              else {
                console.log('enter r');

			coi[1] -= .05;

              }
	  break;

	case 65:  //translate camera left
              if (event.shiftKey) {
                  console.log('enter A');

			pos[0] -= .05;
			coi[0] -= .05;
              }
              else {
                console.log('enter a');

			pos[0] -= .05;
			coi[0] -= .05;
              }
	  break;

	case 68:  //translate camera right
              if (event.shiftKey) {
                  console.log('enter D');

			pos[0] += .05;
			coi[0] += .05;
              }
              else {
                console.log('enter d');

			pos[0] += .05;
			coi[0] += .05;
              }
	  break;

	case 87:
              if (event.shiftKey) {
                  console.log('enter W');

			pos[2] -= .05;
			coi[2] -= .05;
              }
              else {
                console.log('enter w');

			pos[2] -= .05;
			coi[2] -= .05;
              }
	  break;

	case 83:
              if (event.shiftKey) {
                  console.log('enter S');

			pos[2] += .05;
			coi[2] += .05;
              }
              else {
                console.log('enter s');

			pos[2] += .05;
			coi[2] += .05;
              }
	  break;

	case 74:  //move object left
              if (event.shiftKey) {
                  console.log('enter J');
			mMatrix = mat4.translate(mMatrix, [-0.025, 0, 0]);
              }
              else {
                console.log('enter j');
			mMatrix = mat4.translate(mMatrix, [-0.025, 0, 0]);
              }
	  break;

	case 76:  //move object right
              if (event.shiftKey) {
                  console.log('enter L');
			mMatrix = mat4.translate(mMatrix, [0.025, 0, 0]);
              }
              else {
                console.log('enter l');
			mMatrix = mat4.translate(mMatrix, [0.025, 0, 0]);
              }
	  break;

	case 73:  //move object up
              if (event.shiftKey) {
                  console.log('enter I');
			mMatrix = mat4.translate(mMatrix, [0, 0.025, 0]);
              }
              else {
                console.log('enter i');
			mMatrix = mat4.translate(mMatrix, [0, 0.025, 0]);
              }
	  break;

	case 75:  //move object down
              if (event.shiftKey) {
                  console.log('enter K');
			mMatrix = mat4.translate(mMatrix, [0, -0.025, 0]);
              }
              else {
                console.log('enter k');
			mMatrix = mat4.translate(mMatrix, [0, -0.025, 0]);
              }
	  break;

	case 77:  //scales the objects
              if (event.shiftKey) {
                  console.log('enter M');  // scale up
			//mMatrix = mat4.scale(mMatrix, [1.1, 1.1, 1.1]);
			pos[2] *= 1.1;
			coi[2] *= 1.1;
              }
              else {
                console.log('enter m');  // scale down
			//mMatrix = mat4.scale(mMatrix, [0.9, 0.9, 0.9]);
			pos[2] *= 0.95;
			coi[2] *= 0.95;
              }
	  break;


	case 90:  //rotates 'all' of the objects about the z axis
              if (event.shiftKey) {
                  console.log('enter Z');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [0, 0, 1]);
			zrotation -= 10;
              }
              else {
                console.log('enter z');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [0, 0, 1]);
			zrotation += 10;
              }
	  break;


	case 88:  //rotates 'all' of the objects about the x axis
              if (event.shiftKey) {
                  console.log('enter X');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [1, 0, 0]);
			xrotation -= 10;
              }
              else {
                console.log('enter x');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [1, 0, 0]);
			xrotation += 10;
              }
	  break;

	case 67:  //rotates 'all' of the objects about the y axis
              if (event.shiftKey) {
                  console.log('enter C');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [0, 1, 0]);
			yrotation += 10;
              }
              else {
                console.log('enter c');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [0, 1, 0]);
			yrotation += 10;
              }
	  break;

	case 84:  
              if (event.shiftKey) {
                  console.log('enter t');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [0, 1, 0]);
			tetraRotX += 10;
              }
              else {
                console.log('enter T');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [0, 1, 0]);
			tetraRotX += 10;
              }
	  break;

	case 89:  //rotates 'all' of the objects about the y axis
              if (event.shiftKey) {
                  console.log('enter y');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [0, 1, 0]);
			tetraRotY += 10;
              }
              else {
                console.log('enter Y');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [0, 1, 0]);
			tetraRotY += 10;
              }
	  break;

	case 71:  //rotates 'all' of the objects about the y axis
              if (event.shiftKey) {
                  console.log('enter g');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [0, 1, 0]);
			tetraRotZ += 10;
              }
              else {
                console.log('enter G');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [0, 1, 0]);
			tetraRotZ += 10;
              }
	  break;

	case 72:  //rotates 'all' of the objects about the y axis
              if (event.shiftKey) {
                  console.log('enter h');  // rotates clockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(-10), [0, 1, 0]);
			coneRotZ += 10;
              }
              else {
                console.log('enter H');  // rotates counterclockwise
			//mMatrix = mat4.rotate(mMatrix, degToRad(10), [0, 1, 0]);
			coneRotZ += 10;
              }
	  break;
	}
	
		drawScene();
}