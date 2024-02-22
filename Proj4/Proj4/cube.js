"use strict";

var canvas;
var gl;
var program;

var spin=false;
var positions = [];
var colors = [];
var cartAngles=[];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var carts=20;
var axis = 2;
var theta = [0, 0, 0];
var rotating=new Array(carts).fill(-1);
var vertices=[];
var numPositions  = carts*36;
var thetaLoc;

function xChange(r)
{
		theta[0]=r.value;
    //console.log(theta);
    if (!spin) render();
}
function yChange(r)
{
		theta[1]=r.value
    //console.log(theta);
    if (!spin) render();
}
window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    colorCube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );

    //const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons
    document.getElementById("Seat").onclick = function (event) {
        var x=document.getElementById("myRange").value;
        rotating[x]*=-1;
    }
    document.getElementById("Stop").onclick = function (event) {
        spin=!spin;
        if (spin) render();
    }


    /*document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };*/


    //console.log("hello");
    render();
}

function colorCube()
{
  for (let i=0; i<carts; i++){
    var deg=2*Math.PI*i/carts;
    var c = Math.cos(deg);
    var s = Math.sin(deg);
    vertices.push(vec4(0.9*s-(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c-(0.1*carts+0.1*(i+1))/(2*carts),  0.1, 1.0));
    vertices.push(vec4(0.9*s-(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c+(0.1*carts+0.1*(i+1))/(2*carts),  0.1, 1.0));
    vertices.push(vec4(0.9*s+(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c+(0.1*carts+0.1*(i+1))/(2*carts),  0.1, 1.0));
    vertices.push(vec4(0.9*s+(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c-(0.1*carts+0.1*(i+1))/(2*carts),  0.1, 1.0));

    vertices.push(vec4(0.9*s-(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c-(0.1*carts+0.1*(i+1))/(2*carts), -0.1, 1.0));
    vertices.push(vec4(0.9*s-(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c+(0.1*carts+0.1*(i+1))/(2*carts), -0.1, 1.0));
    vertices.push(vec4(0.9*s+(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c+(0.1*carts+0.1*(i+1))/(2*carts), -0.1, 1.0));
    vertices.push(vec4(0.9*s+(0.1*carts+0.1*(i+1))/(2*carts), 0.9*c-(0.1*carts+0.1*(i+1))/(2*carts), -0.1, 1.0));

  }

  for (let i=0; i<vertices.length; i=i+8){
    quad(1+i, 0+i, 3+i, 2+i);
    quad(2+i, 3+i, 7+i, 6+i);
    quad(3+i, 0+i, 4+i, 7+i);
    quad(6+i, 5+i, 1+i, 2+i);
    quad(4+i, 5+i, 6+i, 7+i);
    quad(5+i, 4+i, 0+i, 1+i);
    cartAngles.push(0);

  }
  //console.log(positions.length);
  //console.log(numPositions);
  for (let i=0; i<carts; i++){
    var deg=2*Math.PI*i/carts;
    var c = Math.cos(deg);
    var s = Math.sin(deg);

    positions.push(vec4(0,0,0,1.0));
    positions.push(vec4(0.9*s , 0.9*c, 0 ,1.0));
    colors.push(vec4(0,0,0,1.0));
    colors.push(vec4(0,0,0,1.0));
    //console.log(vec4(0.9*s , 0.9*c, 0 ,1.0));

  }
  positions.push(vec4(0, 0, 0.3, 1.0));
  positions.push(vec4(-0.2, -1, 0.3, 1.0));
  positions.push(vec4(0, 0, 0.3, 1.0));
  positions.push(vec4(0.2, -1, 0.3, 1.0));

  positions.push(vec4(0, 0, -0.3, 1.0));
  positions.push(vec4(-0.2, -1, -0.3, 1.0));
  positions.push(vec4(0, 0, -0.3, 1.0));
  positions.push(vec4(0.2, -1, -0.3, 1.0));

  positions.push(vec4(0, 0, 0.3, 1.0));
  positions.push(vec4(0, 0, -0.3, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));

  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));

  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  colors.push(vec4(1.0, 0.0, 0.0, 1.0));
  var r=0.9;
  for (let i=0; i<200; i++){
        positions.push(vec4(
        r*Math.cos(i%200 * 2 * Math.PI / 200),
        r*Math.sin(i%200 * 2 * Math.PI / 200) , 0.2, 1
        ));
        positions.push(vec4(
        r*Math.cos((i+1)%200 * 2 * Math.PI / 200),
        r*Math.sin((i+1)%200 * 2 * Math.PI / 200) , 0.2, 1
        ));
        colors.push(vec4(0.0, 1.0, 0.0, 1.0));
        colors.push(vec4(0.0, 1.0, 0.0, 1.0));
        positions.push(vec4(
        r*Math.cos(i%200 * 2 * Math.PI / 200),
        r*Math.sin(i%200 * 2 * Math.PI / 200) , -0.2, 1
        ));
        positions.push(vec4(
        r*Math.cos((i+1)%200 * 2 * Math.PI / 200),
        r*Math.sin((i+1)%200 * 2 * Math.PI / 200) , -0.2, 1
        ));
        colors.push(vec4(0.0, 1.0, 0.0, 1.0));
        colors.push(vec4(0.0, 1.0, 0.0, 1.0));
  }
  for (let i=0; i<carts; i++){
      positions.push(vec4(
      r*Math.cos(i * 2 * Math.PI / carts),
      r*Math.sin(i * 2 * Math.PI / carts) , 0.2, 1
      ));
      positions.push(vec4(
      r*Math.cos(i * 2 * Math.PI / carts),
      r*Math.sin(i * 2 * Math.PI / carts) , -0.2, 1
      ));
      colors.push(vec4(0.0, 1.0, 1.0, 1.0));
      colors.push(vec4(0.0, 1.0, 1.0, 1.0));
  }


  //console.log(positions.length);
}

function quad(a, b, c, d)
{


    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 1.0, 1.0, 1.0),  // cyan
        //vec4(1.0, 1.0, 1.0, 1.0),   // white

    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [a, b, c, a, c, d];

    for ( var i = 0; i < indices.length; ++i ) {
        positions.push( vertices[indices[i]] );

        //console.log(positions.length);
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
        //console.log(a/8);
        //colors.push(vertexColors[(Math.floor(indices[i]/8))%7]);
        colors.push(vertexColors[a%7]);
    }
    //console.log(numPositions);
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    /*for (let i=0; i<carts; i++){
      var index=numPositions+2*i+1;
      //console.log(positions[index]);
      var tem =positions[index];
      var ang=Math.atan(tem[1], tem[0]);
      console.log(tem[1]+" "+tem[0]);
      console.log(ang/(2*Math.PI)*360);
    }*/
    if (spin) theta[2] += -1.0;
    for (let i=0; i<carts; i++){
        if (rotating[i]==1){
        var index=numPositions+2*i+1;
        //console.log(positions[index]);
        var tem =positions[index];
        var ang=Math.atan2(tem[1]/0.9, tem[0]/0.9);
        //console.log(tem[1]+" "+tem[0]);
        //console.log(radians(ang)+" "+ang);
        var angles = ang;
        var angZ=cartAngles[i];
        angZ=angZ+Math.PI/180;
        //angY=angY+Math.PI/180;
        var cz = Math.cos(angZ);
        var sz = Math.sin(angZ);
        //var cy = Math.cos(angY);
        //var sy = Math.sin(angY);
        //console.log(c+" "+s);
        // Remeber: thse matrices are column-major
        var rx = mat4(1.0,  0.0,  0.0, 0.0,
    		    0.0,  1,  0, 0.0,
    		    0.0, 0,  1, 0.0,
    		    0.0,  0.0,  0.0, 1.0);

        var ry = mat4(1, 0.0, 0, 0.0,
            0.0, 1.0,  0.0, 0.0,
            0, 0.0,  1, 0.0,
            0.0, 0.0,  0.0, 1.0);


        var rz = mat4(cz, sz, 0.0, 0.0,
            -sz,  cz, 0.0, 0.0,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0);
      //  var rota=mat4( )
        //console.log(mult(rx,ry));
        //vColor = aColor;
        for (let j=0; j<36; j++){
          //console.log(positions[8*i+j]);
          var sub=subtract(positions[36*i+j],vec4(tem[0],tem[1],0,0));
          positions[36*i+j]=add(mult(mult(mult(rz,ry),rx),sub),vec4(tem[0],tem[1],0,0));
          //positions[36*i+j]=mult(mult(mult(rz,ry),rx),positions[36*i+j]);
          //console.log(positions[8*i+j]);
        }
        }

    }
    if (spin){
    for (let i=0; i<10; i++){
        //var deg=-(radians(theta[2]));
        var deg=radians(1);
        var sz=Math.sin(deg);
        var cz=Math.cos(deg);
        positions[numPositions+2*carts+i]=mult( mat4(cz, sz, 0.0, 0.0,
            -sz,  cz, 0.0, 0.0,
            0.0,  0.0, 1.0, 0.0,
            0.0,  0.0, 0.0, 1.0), positions[numPositions+2*carts+i]);
    }}
    //const bufferInfo = webglUtils.createBufferInfoFromArrays(gl, data);
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positions), gl.STATIC_DRAW);


    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
    //theta[0]+=1

    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLES, 0, numPositions);
    gl.drawArrays(gl.LINES, numPositions, 2*carts);
    gl.drawArrays(gl.LINES, numPositions+2*carts, 812+2*carts);
    if (spin) requestAnimationFrame(render);
}
