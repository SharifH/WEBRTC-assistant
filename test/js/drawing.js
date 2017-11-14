window.addEventListener('load', init);
function canvasOverlay() {
  var dataUrl;
  var data;
  var newImage;
  var newDiv;
  var newImgWrap;

  // Receive from any other mouse event
  socket.on('othermouse', function(data) {
    odraw(data.x, data.y);
  });

  // Receive someone else's canvas
  socket.on('clearImage', function() {
    console.log("clear ready");
    clearImage(false);

  });

  // Send the mouse
  var sendmouse = function(xval, yval) {

    socket.emit('othermouse', {
      x: xval,
      y: yval
    });
  };

  // Send the clear
  var clearImage = function(iClicked) {

    // Clear the drawing
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (iClicked) {
      socket.emit('cleared', '');
    }
  };

  ///////////////

  var canvas;
  var context;
  var canvasRect;
  var currentlyDrawing = false;
  var px = 0;
  var py = 0;
  var background = 'transparent';
  var strokeColor = '#222';

  function init() {
    canvas = document.getElementById('mycanvas');
    context = canvas.getContext('2d');

    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Detect if mouse is moving
    canvas.addEventListener('mousemove', function(evt) {

      //evt.clientX is x but in the entire window, not the canvas
      //evt.clientY is y

      // Get the canvas bounding rect
      canvasRect = canvas.getBoundingClientRect();

      // Now calculate the mouse position values
      y = evt.clientY - canvasRect.top; // minus the starting point of the canvas rect
      x = evt.clientX - canvasRect.left; // minus the starting point of the canvas rect on the x axis

      if (currentlyDrawing) {

        draw(x, y);
        sendmouse(x, y);

      }

      document.getElementById('clear').onclick = function() {

        // Send the image to the other person on button click
        clearImage(true);

      };

    }, false);

    // Detect if the left mouse button is pressed
    canvas.onmousedown = function(evt) {
      // I'm drawing
      currentlyDrawing = true;
      // Begin drawing where mouse is
      canvasRect = canvas.getBoundingClientRect();
      y = evt.clientY - canvasRect.top; // minus the starting point of the canvas rect
      x = evt.clientX - canvasRect.left; // minus the starting point of the canvas rect on the x axis
      px = x;
      py = y;
    };

    canvas.onmouseup = function() {
      // I stopped drawing
      currentlyDrawing = false;

    };

  } // Close init

  var draw = function(xval, yval) {

    //console.log("draw " + xval + " " + yval);

    context.beginPath();

    // This is silly but it's what we have to do to get a random hex string
    context.strokeStyle = strokeColor;

    context.moveTo(px, py);
    context.lineTo(xval, yval);

    context.stroke();

    px = xval;
    py = yval;
  };

  var opx = 0;
  var opy = 0;

  var odraw = function(xval, yval) {

    //console.log("draw " + xval + " " + yval);

    context.beginPath();

    context.strokeStyle = strokeColor;

    context.moveTo(opx, opy);
    context.lineTo(xval, yval);

    context.stroke();

    opx = xval;
    opy = yval;
  };
};
