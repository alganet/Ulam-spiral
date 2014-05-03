"use strict";

(function(win, doc, nav) {
    var canvas, context, width, height, num, size, resolution;
    var Spiral = function() {
        var radius = (resolution / 2) || 6;
        var radiusPow = Math.pow(width / radius, 2);
        var halfRadius = radius / 2;
        var twiceRadius =  radius * 2;
        //init is -1,-1
        var point = {
            x : 0,
            y : 0
        };
        //0:right;1:up,2:left,3:down
        var direction = {
            0 : {
                "x" : 1,
                "y" : 0
            },
            1 : {
                "x" : 0,
                "y" : 1
            },
            2 : {
                "x" : -1,
                "y" : 0
            },
            3 : {
                "x" : 0,
                "y" : -1
            }
        }
        var drawPoint = function(opt) {
            opt = opt || {};
            opt.x = opt.x || 0;
            opt.y = opt.y || 0;
            opt.radius = opt.radius || halfRadius;
            context.beginPath();
            var coord = {
                x : (width / 2) + (opt.x * twiceRadius),
                y : (height / 2) + (-1 * opt.y * twiceRadius)
            };
            context.arc(coord.x, coord.y, opt.radius, 0, 2 * Math.PI, false);
            context.fillStyle = opt.color;
            context.fill();
            return true;
        };
        var setDirection = function(point, dirIndex) {
            if ((dirIndex >= 0 || dirIndex < 4)) {
                point.x += direction[dirIndex].x;
                point.y += direction[dirIndex].y;
            }
            return point;
        }
        var nextDirection = function(dir) {
            dir += 1;
            if (dir > 3) {
                dir = 0;
            }
            return dir;
        };
        var generate = function() {
            var directionSteps = 1;
            var directionIndex = 0;
            //var i = 1;
            var i = num;
            drawPoint({
                x : point.x,
                y : point.y,
                color : '#000',
                radius : halfRadius
            });
            var cont = true;
            var t0 = new Date().getTime();
            do {
                for (var k = 0; k < 2; k++) {
                    for (var ds = 0; ds < directionSteps; ds += 1) {
                        i += 1;
                        //increment number
                        point = setDirection(point, directionIndex);

                        var pointToDraw = {};
                        var mu = mobiusFunc(i);
                        var mainF = (Math.sqrt(Math.sqrt(i) / Math.PI));
                        var alpha = ( radius / mainF / Math.PI ) * Math.pow(point.y, point.x);
                        //var alpha = ( radius / mainF / Math.PI ) * Math.sqrt(point.y);
                        var rads =  ( radius * mainF / Math.PI );
                        if (mu[1] === -1) {      // red odd unique factors
                            pointToDraw = {
                                x : point.x,
                                y : point.y,
                                color : 'rgba(255, 0, 0, '+ alpha +')',
                                radius : rads
                            };
                        } else if (mu[1] === 1) { // blue even unique factors
                            pointToDraw = {
                                x : point.x,
                                y : point.y,
                                color : 'rgba(0, 0, 255, '+ alpha +')',
                                radius : rads
                            };

                        } else {                  // green non unique factors
                            pointToDraw = {
                                x : point.x,
                                y : point.y,
                                color : 'rgba(0, 255, 0, '+ alpha +')',
                                radius : rads
                            };
                        }
                        if (mu[0].length == 1) {  // primes
                            pointToDraw.color  = 'rgba(255, 255, 255, 1)';
                            pointToDraw.radius = rads
                        }
                        drawPoint(pointToDraw);

                        if (i >= (radiusPow)) {
                            cont = false;
                            return (new Date().getTime()) - t0;
                        }
                    }
                    directionIndex = nextDirection(directionIndex);
                }
                directionSteps += 1;
            } while (cont) ;
            return (new Date().getTime()) - t0;
        }
        return {
            generate : generate
        }
    };




    //generate
    var generate = function() {
        try {
            document.getElementById('canvas').setAttribute('style', 'width: 100%');
            num = 1;
            var canvasSize = Math.floor(Math.sqrt(parseInt(document.getElementById('canvasSize').value, 10)));
            resolution = 12;
            var realCanvas = doc.getElementById("canvas");
            canvas = document.createElement('canvas');
            canvas.width = (canvasSize * resolution);
            canvas.height = canvas.width;
            width = parseInt(canvas.width, 10);
            height = parseInt(canvas.height, 10)
            context = canvas.getContext("2d");
            context.rect(0, 0, width, height);
            context.fillStyle = '#000';
            context.fill();
            var spiral = new Spiral();
            realCanvas.width  = canvas.width;
            realCanvas.height = canvas.height;
            document.getElementById('generateButton').innerHTML = spiral.generate();
            realCanvas.getContext("2d").drawImage(canvas, 0, 0);
        } catch(e) {
            console.log(e);
        }

    }
    window.onload = function() {
        document.getElementById('generateButton').onclick = function() {
            generate();
        };
        generate();
    };

})(window, document, navigator);

    var mobiusFunc = function(num) {
        var factors = factor(num);
        var unique  = factors.filter(function(itm,i,a){
            return i==a.indexOf(itm);
        });
        if (factors.length !== unique.length) {
            return [factors, 0];
        } else if(!!(num && !(num%2))) {
            return [factors, 1];
        } else {
            return [factors, -1];
        }
    }


    function factor(n) {
     if (isNaN(n) || !isFinite(n) || n%1!=0 || n==0) return[n];
     var minFactor = leastFactor(n);
     if (n==minFactor) return [n];
     return factor(n/minFactor).concat(minFactor);
    }


    // find the least factor in n by trial division
    function leastFactor(n) {
     if (isNaN(n) || !isFinite(n)) return NaN;  
     if (n==0) return 0;  
     if (n%1 || n*n<2) return 1;
     if (n%2==0) return 2;  
     if (n%3==0) return 3;  
     if (n%5==0) return 5;  
     var m = Math.sqrt(n);
     for (var i=7;i<=m;i+=30) {
      if (n%i==0)      return i;
      if (n%(i+4)==0)  return i+4;
      if (n%(i+6)==0)  return i+6;
      if (n%(i+10)==0) return i+10;
      if (n%(i+12)==0) return i+12;
      if (n%(i+16)==0) return i+16;
      if (n%(i+22)==0) return i+22;
      if (n%(i+24)==0) return i+24;
     }
     return n;
    }
