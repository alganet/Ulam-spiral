/**
 * On message check for prime and send to parent for drawing
 * @param {Object} oEvent
 */
onmessage = function(oEvent) {
    var data = JSON.parse(oEvent.data);
    var point = data.point;
    var i = data.number;
    var pointToDraw = {};
    var mu = mobiusFunc(i);
    var dot = data.radius * 1;
    if (mu[1] === -1) {      // green odd unique factors
        pointToDraw = {
            x : point.x,
            y : point.y,
            color : '#0A0',
            radius : dot
        };
    } else if (mu[1] === 1) { // red even unique factors
        pointToDraw = {
            x : point.x,
            y : point.y,
            color : '#A00',
            radius : dot
        };

    } else {                  // blue non unique factors
        pointToDraw = {
            x : point.x,
            y : point.y,
            color : '#00A',
            radius : dot
        };
    }
    if (mu[0].length == 1) {  // primes
        pointToDraw.color  = '#555';
        pointToDraw.radius = dot * Math.sqrt(Math.sqrt(i) / Math.PI) / Math.PI
    }
    postMessage(JSON.stringify(pointToDraw));
};

    function factor(n) {
     if (isNaN(n) || !isFinite(n) || n%1!=0 || n==0) return ''+n;
     if (n<0) return '-'+factor(-n);
     var minFactor = leastFactor(n);
     if (n==minFactor) return ''+n;
     return minFactor+'*'+factor(n/minFactor);
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

    //is prime number?
    var isPrime = function(num) {
        var factors = factor(num).split("*");
        return factors.length === 1;
    }

    var mobiusFunc = function(num) {
        var factors = factor(num).split("*");
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