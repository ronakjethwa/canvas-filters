/**
 * Created by Ronak on 8/5/2015.
 */
var thresholdValue = document.querySelector('body > label');
thresholdValue.innerHTML = 'Slide to set  threshold';

var filters = {
    blueTint: function(pixelArray){
        for(var i = 0; i < pixelArray.length; i+=4){
            pixelArray[i] = 0;
            pixelArray[i+1] = 0;
        }
    },
    grayscale: function(pixelArray){
        for(var i = 0; i < pixelArray.length; i+=4){
            pixelArray[i] = pixelArray[i+1] = pixelArray[i+2] = gr(i);
        }

        function gr(i){
            return pixelArray[i]*.21 + pixelArray[i+1]*.72 +  pixelArray[i+2]*.07;
        }
    },
    threshold: function(pixelArray, threshold_value){
        for(var i = 0; i < pixelArray.length; i+=4){
            if (gr(i) > threshold_value){
                pixelArray[i] = pixelArray[i+1] = pixelArray[i+2] = 255;
            }
            else{
                pixelArray[i] = pixelArray[i+1] = pixelArray[i+2] = 0;
            }
        }

        function gr(i){
            return pixelArray[i]*.21 + pixelArray[i+1]*.72 +  pixelArray[i+2]*.07;
        }
    },
    focus_color: function(pixelArray,red,green,blue){
        var targetHue = hue(red,green,blue);
        console.log('target hue: ' + targetHue);
        for(var i = 0; i < pixelArray.length; i+=4){
            var currentHue = hue(pixelArray[i],pixelArray[i+1],pixelArray[i+2]);

            if (currentHue >= targetHue - 50 && currentHue <= targetHue + 50){
            }
            else pixelArray[i] = pixelArray[i+1] = pixelArray[i+2] = gr(i);
        }

        function gr(i){
            return pixelArray[i]*.21 + pixelArray[i+1]*.72 +  pixelArray[i+2]*.07;
        }

        function hue(r,g,b){
            r = r/255;
            g = g/255;
            b = b/255;
            var maxValue;
            var minValue;
            // first find which rgb color is strongest
            if (r > g){
                if (r > b){
                    maxValue = 1;
                    if (g < b){
                        minValue = g;
                    }
                    else minValue = b;
                }
                else if (g > b){
                    maxValue = 2;
                    if (r < b){
                        minValue = r;
                        if (g < b){
                            minValue = g;
                        }
                        else minValue = b;
                    }
                    else minValue = b;
                }
            }
            else if (g > b){
                maxValue = 2;
                if (r < b){
                    minValue = r;
                }
                else minValue = b;
            }
            else{
                maxValue = 3;
                minValue = r;
            }
            //now find the hue
            if (maxValue === 1){
                return Math.round((g - b)/(r - minValue)*60);
            }
            else if (maxValue === 2){
                return Math.round((2 + (b - r)/(g - minValue))*60);
            }
            else return Math.round((4 + (r - g)/(b - minValue))*60);
        }
    },
    brighten: function(pixelArray){
        for(var i = 0; i < pixelArray.length; i++){
            pixelArray[i]+=20;
        }
    },
    old_timey: function(pixelArray, width, height){
        var pixelPosition;
        var pixelRow;
        var pixelCol;
        var centerX = width/2;
        var centerY = height/2;
        var distX;
        var distY;
        var distFromCenter;
        for(var i = 0; i < pixelArray.length; i+=4){

            pixelPosition = i/4;
            pixelRow = pixelPosition/width;
            pixelCol = pixelPosition%width;
            distX = Math.abs(centerX - pixelCol);
            distY = Math.abs(centerY - pixelRow);
            distFromCenter = Math.sqrt(Math.pow(distX,2) + Math.pow(distY,2));
            if(distFromCenter > 130){
                pixelArray[i]+=(distFromCenter - 130);
                pixelArray[i+1]+=(distFromCenter - 130);
                pixelArray[i+2]+=(distFromCenter - 130);
            }
        }

    }
};

var can = document.querySelector('canvas');
var context = can.getContext('2d');
var resetter = document.getElementById('button0');
var undoer = document.getElementById('button6');
var bluer = document.getElementById('button1');
var grayer = document.getElementById('button2');
var focusser = document.getElementById('button3');
var brighter = document.getElementById('button4');
var older = document.getElementById('button5');
var ranger = document.querySelector('input[type="range"]');

var img = document.querySelector('img');
img.addEventListener('load', function () {
    console.log('Image is loaded');
    context.drawImage(img,0,0);
    var imageData = context.getImageData(0,0,337,600);
    var  pixelArray = imageData.data;
    context.putImageData(imageData,0,0);

    var tempArray = context.getImageData(0,0,337,600);

    //reset button
    resetter.addEventListener('click', function(){
        thresholdValue.innerHTML = 'Slide to set  threshold';
        context.drawImage(img,0,0);
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        context.putImageData(imageData,0,0);
        undoer.innerHTML = 'Undo Last';
    });

    //undo button
    undoer.addEventListener('click', function(){
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        context.putImageData(tempArray,0,0);
        tempArray = imageData;
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        undoer.innerHTML = 'Redo Last';
    });

    //blue tint button
    bluer.addEventListener('click', function(){
        tempArray = imageData;
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        filters.blueTint(pixelArray);
        context.putImageData(imageData,0,0);
        undoer.innerHTML = 'Undo Last';
    });

    //greyscale button
    grayer.addEventListener('click', function(){
        tempArray = imageData;
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        filters.grayscale(pixelArray);
        context.putImageData(imageData,0,0);
        undoer.innerHTML = 'Undo Last';
    });

    //brighten button
    brighter.addEventListener('click', function(){
        tempArray = imageData;
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        filters.brighten(pixelArray,450,300);
        context.putImageData(imageData,0,0);
        undoer.innerHTML = 'Undo Last';
    });

    //old timey button
    older.addEventListener('click', function(){
        tempArray = imageData;
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        filters.old_timey(pixelArray, 600, 337);
        context.putImageData(imageData,0,0);
        undoer.innerHTML = 'Undo Last';
    });

    // threshold slider
    ranger.addEventListener('input', function(){
        tempArray = imageData;
        thresholdValue.innerHTML = this.value;
        console.log(this.value);
        context.drawImage(img,0,0);
        imageData = context.getImageData(0,0,600,337);
        pixelArray = imageData.data;
        filters.threshold(pixelArray, this.value);
        context.putImageData(imageData,0,0);
        undoer.innerHTML = 'Undo Last';
    });
})
