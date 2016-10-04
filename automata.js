/* Implementación de la clase automata */
function Automata(struct){
  var self = this;
  this.estados = struct.q;
  this.alfabeto = struct.e;
  this.estadoI = struct.s;
  this.estadosF = struct.f;
  this.funcionTransicion = struct.d;
  this.transiciones = [];
  this.totalFinales = 0;
  self.coordenadas = [];

  this.print = function(){
    console.dir(this);
  }

  this.getDestinos =  function(estado, entrada){
      console.log("Get destino: " + estado + "("+entrada+")");
      if(angular.isUndefined(this.funcionTransicion)) return false; //'ERROR_NO_ESTADO';
      if(angular.isUndefined(this.funcionTransicion[estado])) return false; //'ERROR_NO_ESTADO';
      if(angular.isUndefined(this.funcionTransicion[estado][entrada])) return false;//'ERROR_NO_TRANSICION';
      // return {hojas: $scope.automataWork.d[estado][entrada]};
      var transition = estado+","+entrada+","+this.funcionTransicion[estado][entrada].join('|');
      self.transiciones.push(transition);
      return this.funcionTransicion[estado][entrada];
  }

  this.esFinal = function(estado){
    return (self.estadosF.indexOf(estado) !== -1);
  }

  this.contarFinales = function(arreglo_estados){
    var total = 0;
    angular.forEach(arreglo_estados, function(estado){
      if(self.esFinal(estado)){//si existe
        total+=1;
      }
    });
    return total;
  }

  this.validarPalabra = function(cadena,estado){
    console.log("doValidar");
    if(angular.isUndefined(estado)){
      self.totalFinales = 0;
      self.transiciones.length = 0;
      estado =  this.estadoI;//estado inicial
    }
    if(cadena.length == 1) {
      self.totalFinales += self.contarFinales(this.getDestinos(estado, cadena));
      var res = {};
      res[cadena] =  self.getDestinos(estado, cadena);
      return res;
    }
    var estadosNuevos = self.getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
    var arbol =  {};
    var caminos = {};
    angular.forEach(estadosNuevos, function(v,k){
      console.log("Estado nuevo: " + v);
      var first =  cadena.charAt(0);
      var resto = cadena.substr(1, cadena.length);
      if(angular.isUndefined(caminos[first])) caminos[first] = {};
      caminos[first][v] = self.validarPalabra(resto, v)
    });
    return caminos;
  }

  //Genera un conjunto de coordenadas para posicionar los estados
  this.generarCoordenadas = function(){
    self.coordenadas.length = 0;
    console.dir(self.estados);
    // total = self.estados.length;
    totalX = Math.floor(Math.sqrt(self.estados.length));
    totalY = Math.ceil(Math.sqrt(self.estados.length));
    console.dir(totalX);
    console.dir(totalY);
    if((totalX * totalY) < self.estados.length) totalX += (self.estados.length - (totalX * totalY));
    for(var i = 0; i < totalX; i++){
      for (var j = 0; j < totalY; j++) {
        var coord = {
          x: i*300 + 50,
          y: j*250 + 50
        }
        self.coordenadas.push(coord);
      }
    }

    console.dir(self.coordenadas);
    return self.coordenadas;

  }

  // this.dibujar = function(canvasID){
  //     var c=document.getElementById(canvasID);
  //     var ctx=c.getContext("2d");
  //     ctx.clearRect(0, 0, c.width, c.height);//limpiar
  //     ctx.beginPath();
  //     var x = 0;
  //     var y = 0;
  //     var separation = 200;
  //     var estados = [];
  //     for(var i = 0; i < self.estados.length; i++){
  //       //get position
  //       if(i == 0){
  //         x = 30;
  //         y = 30;
  //       }else{
  //         if((x+separation) < (c.width + 10)){
  //           x = x+separation;
  //         }else{
  //           y = y+separation;
  //           x = 30;
  //           moveTo(x,y);
  //         }
  //       }
  //       estados.push({e: self.estados[i], pos: {x:x, y:y}});
  //       ctx.moveTo(x+30, y);
  //       ctx.arc(x,y,30,0,2*Math.PI);
  //       //ctx.fill();
  //       ctx.closePath();
  //       //ctx = c.getContext("2d");
  //       ctx.moveTo(x, y);
  //       ctx.textAlign="center";
  //       ctx.fillStyle = 'black';
  //       ctx.font = "30px Montserrat ";
  //       ctx.fillText(self.estados[i],x ,y + 8);
  //
  //     }
  //     ctx.stroke();
  //     console.dir(estados);
  //
  //     // ctx.arc(100,75,30,0,2*Math.PI);
  //     // ctx.fillStyle = 'white';
  //     // ctx.fill();
  //     // ctx.fillStyle = 'black';
  //     // ctx.font = "30px Montserrat";
  //     // ctx.fillText("1",100 -10 ,75 + 8);
  //
  //
  //
  // }

}
