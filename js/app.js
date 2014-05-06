"use strict";


    var mobiusCache = {};

    var mobiusFunc = function(num) {
        num = Math.abs(num);
        if (num in mobiusCache) {
            return mobiusCache[num];
        }
        var factors = factor(num);
        var unique  = factors.filter(function(itm,i,a){
            return ( i==a.indexOf(itm) );
        });
        if (factors.length !== unique.length) {
            return mobiusCache[num] = [factors, 0];
        } else if(!!(num && !(num%2))) {
            return mobiusCache[num] = [factors, 1];
        } else {
            return mobiusCache[num] = [factors, -1];
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
     }
     return n;
    }


(function(win, doc, nav) {
    var primes = [];
    var canvas, context, width, height, num, size, resolution, divisor;
    var Spiral = function() {
        var radius = (resolution / 2) || 6;
        var radiusPow = Math.pow(width / radius, 2);
        var halfRadius = radius / 2;
        var twiceRadius =  radius * 2;
        var halfWidth = (width / 2);
        var halfHeight = (height / 2);
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
            opt.x = opt.x;
            opt.y = opt.y;
            opt.radius = opt.radius;
            context.beginPath();
            context.arc(
                halfWidth + (opt.x * twiceRadius), 
                halfHeight + (-1 * opt.y * twiceRadius), 
                opt.radius, 
                1, 
                0, 
                false
            );
            context.fillStyle = opt.color;
            context.fill();
            return true;
        };
        var setDirection = function(point, dirIndex) {
            point.x += direction[dirIndex].x;
            point.y += direction[dirIndex].y;
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
            var i = num;
            var cont = true;
            do {
                for (var k = 0; k < 2; k++) {
                    for (var ds = 0; ds < directionSteps; ds += 1) {
                        i = i+1/divisor;
                        if (i>0) {
                            var stepI = Math.floor(i);
                        } else {
                            var stepI = Math.ceil(i);
                        }
                        point = setDirection(point, directionIndex);

                        var computedAlpha = 0.5;
                        var computedRadius = 7;
                        var pointToDraw = {};
                        if (stepI==0 || stepI==1) {
                            drawPoint({
                                x : point.x,
                                y : point.y,
                                color : 'rgba(0, 0, 0, '+ computedAlpha +')',
                                radius : computedRadius
                            });
                            continue;
                        }
                        var mu = mobiusFunc(stepI);

                        if (mu[1] === -1) {  // red odd unique factors
                            pointToDraw = {
                                x : point.x,
                                y : point.y,
                                color : 'rgba(200, 0, 0, '+ computedAlpha +')',
                                radius : computedRadius
                            };
                        } else if (mu[1] === 1) { // blue even unique factors
                            pointToDraw = {
                                x : point.x,
                                y : point.y,
                                color : 'rgba(0, 0, 200, '+ computedAlpha +')',
                                radius : computedRadius
                            };

                        } else {                  // green non unique factors
                            pointToDraw = {
                                x : point.x,
                                y : point.y,
                                color : 'rgba(0, 200, 0, '+ computedAlpha +')',
                                radius : computedRadius
                            };
                        }

                        if (mu[0].length == 1) {  // one factor
                            if (parseInt(i) === stepI) { // prime
                                pointToDraw = {
                                    x : point.x,
                                    y : point.y,
                                    color : 'rgba(255, 255, 255, '+ computedAlpha*1.5 +')',
                                    radius : computedRadius
                                };
                                primes.push(i);
                            }
                        } 

                        
                        if (mu[0].length == 2 // two factors, semi primes
                            && mobiusFunc(mu[0][0])[0].length ==1
                            && mobiusFunc(mu[0][1])[0].length ==1) {
                            drawPoint({
                                x : point.x,
                                y : point.y,
                                color : 'rgba(255, 255, 255, '+ computedAlpha +')',
                                radius : computedRadius
                            });
                        } else if (mu[0].length == 3 // two factors, semi primes
                            && mobiusFunc(mu[0][0])[0].length ==1
                            && mobiusFunc(mu[0][1])[0].length ==1
                            && mobiusFunc(mu[0][2])[0].length ==1) {
                            drawPoint({
                                x : point.x,
                                y : point.y,
                                color : 'rgba(255, 255, 255, '+ computedAlpha +')',
                                radius : computedRadius / 2
                            });
                        }

                        drawPoint(pointToDraw);

                        if (i >= (radiusPow)) {
                            cont = false;
                        }
                    }
                    directionIndex = nextDirection(directionIndex);
                }
                directionSteps += 1;
            } while (cont);
        }
        return {
            generate : generate
        }
    };




    //generate
    var generate = function(init, divi) {
        try {
            divisor = divi || 1;
            num = (init || 1)/divisor;
            context.save();
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.restore();
            context.rect(0, 0, width, height);
            context.fillStyle = '#000';
            context.fill();
            var spiral = new Spiral();
            spiral.generate();
        } catch(e) {
            console.log(e);
        }

    }
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000);
              };
    })();

    var start = document.getElementById('start').value, canvasS;
    
    divisor = document.getElementById('divisor').value;
    document.getElementById('divisor').onchange = function () {
        divisor = this.value;
    };


    var sizeInit =function () {
        canvasS = parseInt(document.getElementById('canvasSize').value);
        canvas = doc.getElementById("canvas");
        resolution = 12;
        var canvasSize = Math.floor(Math.sqrt(canvasS, 10));
        canvas.width = (canvasSize * resolution);
        canvas.height = canvas.width;
        width = parseInt(canvas.width, 10);
        height = parseInt(canvas.height, 10)
        context = canvas.getContext("2d");
        start = document.getElementById('start').value;
    };
    sizeInit();

    document.getElementById('canvasSize').onchange = sizeInit;

    var radiusP = document.getElementById('size').checked;
    var alphaP = document.getElementById('alpha').checked;

    document.getElementById('size').onchange = function () {
        if (this.checked) {
            radiusP = true;
        } else {
            radiusP = false;
        }
    };
    document.getElementById('start').onchange = function () {
        start = this.value;
    };
    document.getElementById('alpha').onchange = function () {
        if (this.checked) {
            alphaP = true;
        } else {
            alphaP = false;
        }
    };

    function animloop(){
      if (start <= canvasS) {
        generate(++start, divisor);
        requestAnimFrame(animloop);
      }
    };

    document.getElementById('anim').onclick = function (e) {
        animloop();
        e.preventDefault();
    };

})(window, document, navigator);
