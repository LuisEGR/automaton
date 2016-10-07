/* Implementación de la clase automata */
function Automata(struct){
  var self = this;
  this.estados = struct.q;
  this.alfabeto = struct.e;
  this.estadoI = struct.s;
  this.estadosF = struct.f;
  this.funcionTransicion = struct.d;
  this.funcionInversa = struct.di;
  this.transiciones = [];
  this.totalFinales = 0;
  this.finalesAlcanzados = [];
  self.coordenadas = [];
  this.rutaInvers = "";
  this.print = function(){
    console.dir(this);
  }

  // Convertir arreglo a objeto [] -> {}
  this.toObject = function(arreglo){
    var r = {};
    for(var i = 0; i < arreglo.length; i++){
      r[i] = arreglo[i];
    }
    return r;
  }

  //Obtengo los destinos desde un estado con determinada entrada.
  this.getDestinos =  function(estado, entrada){
      // console.log("Get destino: " + estado + "("+entrada+")");
      if(angular.isUndefined(this.funcionTransicion)) return false; //'ERROR_NO_FUNCION_TRANSICION';
      if(angular.isUndefined(this.funcionTransicion[estado])) return false; //'ERROR_NO_ESTADO';
      if(angular.isUndefined(this.funcionTransicion[estado][entrada+""])) return false;//'ERROR_NO_TRANSICION';
      //var transition = estado+","+entrada+","+this.funcionTransicion[estado][entrada+""].join('|');
      //self.transiciones.push(transition);
      return this.funcionTransicion[estado][entrada+""];
  }



  //Comprueba si un estado es estado final
  this.esFinal = function(estado){
    return (self.estadosF.indexOf(estado) !== -1);
  }

  //Cuenta cuantos estados finales hay en un arreglo de estados
  this.contarFinales = function(arreglo_estados){
    var total = 0;
    angular.forEach(arreglo_estados, function(estado){
      if(self.esFinal(estado)){//si es final
        total+=1;
      }
    });
    return total;
  }

  //Une un arreglo con una estructura específica para
  //mostrar los caminos de forma entendible
  this.jn = function(arr){
    var r = "";
    for(var i = 0; i<arr.length; i++){
      if(i%2 == 0){
        r += "("+arr[i]+")";
      }else{
        r += "→"+arr[i];
      }
    }
    return r;
  }

  //Aplana el objeto y a cada camino se le aplica un tratamiento
  //como cadena para mostrarlos entendiblemente
  this.aplanar = function(obj){
    //Convierto el objeto {"camino":"destinos"} a un arreglo de caminos ["camino→destinos", ...]
    var Arrplano = $.map(_flat(obj), function(value, index) {
        return [index+'→'+value];
    });
    var Arr2 = [];
    for(var i = 0; i < Arrplano.length; i++){//por cada camino no bien formateado
      var all = Arrplano[i].split('→');
      var last = all[all.length-1].split(',');
      var arr_temp = all.slice(0, all.length -1);
      var tn = "";
      for(j=0;j<last.length; j++){
        Arr2.push(self.estadoI+self.jn(arr_temp)+'→'+last[j]);
      }
    }
    return Arr2;
  }

  //Une, si es un arreglo entonces con join, si es false regresa ε
  //de lo contrario regresa la entrada, por que es una cadena
  this.unir = function(arr_str){
      if(Array.isArray(arr_str)) return arr_str.join(',');
      if(arr_str == false) return 'ε';
      return arr_str;
  }

  //Función recursiva para validar una palabra, recibe como parametros
  //la cadena y el estado, este último es opcional, y en caso de que no exista
  //Se tomará el estado inicial.
  this.validarPalabra = function(cadena,estado){
    var caminos = {};
    if(angular.isUndefined(estado)){
      self.totalFinales = 0;
      self.transiciones.length = 0;
      estado =  this.estadoI;//estado inicial
    }
    if(cadena.length == 1) {
      self.totalFinales += self.contarFinales(this.getDestinos(estado, cadena));
      //self.agregarFinales(this.getDestinos(estado, cadena));
      var res = {};
      res[cadena] =  self.unir(self.getDestinos(estado, cadena));
      return res;
    }
    var estadosNuevos = self.getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
    if(estadosNuevos == false){//Si no tiene destinos
      caminos[cadena.charAt(0)] = 'ε';
      return caminos;
    }

    angular.forEach(estadosNuevos, function(v,k){
      var first =  cadena.charAt(0);
      var resto = cadena.substr(1, cadena.length);
      if(angular.isUndefined(caminos[first])) caminos[first] = [];
      caminos[first][v] = self.validarPalabra(resto, v)//Valida el resto de la palabra de forma recursiva
    });
    return caminos;
  }

  //Función recursiva para validar una palabra con transiciones Epsilon, recibe como parametros
  //la cadena y el estado, este último es opcional, y en caso de que no exista
  //Se tomará el estado inicial.
  this.validarPalabraEpsilon = function(cadena,estado){
    var caminos = {};
    var res = {};

    if(angular.isUndefined(estado)){
      self.totalFinales = 0;
      self.transiciones.length = 0;
      estado =  this.estadoI;//estado inicial
      cadena = cadena+'e';//Entrada final como epsilon
    }
    if(cadena.length == 1) {
      var dest_ = self.getDestinos(estado, cadena);
      console.log("("+estado+","+cadena+") Destinos: "+dest_);
      if(dest_ == false){ //si no hay transición con ese simbolo
        dest_ = self.getDestinos(estado, 'e');//busco destinos con epsilon
        console.log("Hay +"+dest_.length+"+transiciónes epsilon!");
        if(dest_ != false){//si sí tiene destinos con epsilon
          angular.forEach(dest_, function(estadoNuevo){//por cada nuevo destino,
            if(angular.isUndefined(caminos[cadena+"_e"])) caminos[cadena+"_e"] = [];
            caminos[cadena+"_e"][estadoNuevo] = self.validarPalabra(cadena, estadoNuevo);//valido la palabra
          });
          return caminos;
        }
      }
      self.totalFinales += self.contarFinales(dest_);
      res[cadena] =  self.unir(dest_);
      return res;
    }
    var estadosNuevos = self.getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
    if(estadosNuevos == false){//Si no tiene destinos
      estadosNuevos = self.getDestinos(estado, 'e');
      console.log("Hay +"+estadosNuevos.length+"+transiciónes epsilon!");
      if(estadosNuevos != false){
        angular.forEach(estadosNuevos, function(estadoNuevo){//por cada nuevo destino,
          if(angular.isUndefined(caminos[cadena.charAt(0)+"_e"])) caminos[cadena.charAt(0)+"_e"] = [];
          caminos[cadena.charAt(0)+"_e"][estadoNuevo] = self.validarPalabra(cadena, estadoNuevo);//valido la palabra
        });
        return caminos;
      }
      caminos[cadena.charAt(0)] = 'ε';
      return caminos;
    }

    angular.forEach(estadosNuevos, function(v,k){
      var first =  cadena.charAt(0);
      var resto = cadena.substr(1, cadena.length);
      if(angular.isUndefined(caminos[first])) caminos[first] = [];
      caminos[first][v] = self.validarPalabra(resto, v)//Valida el resto de la palabra de forma recursiva
    });
    return caminos;
  }

  //////////////// NO implementado /////////////
  //Genera un conjunto de coordenadas para posicionar los estados
  // this.generarCoordenadas = function(){
  //   self.coordenadas.length = 0;
  //   console.dir(self.estados);
  //   // total = self.estados.length;
  //   totalX = Math.floor(Math.sqrt(self.estados.length));
  //   totalY = Math.ceil(Math.sqrt(self.estados.length));
  //   console.dir(totalX);
  //   console.dir(totalY);
  //   if((totalX * totalY) < self.estados.length) totalX += (self.estados.length - (totalX * totalY));
  //   for(var i = 0; i < totalX; i++){
  //     for (var j = 0; j < totalY; j++) {
  //       var coord = {
  //         x: i*300 + 50,
  //         y: j*250 + 50
  //       }
  //       self.coordenadas.push(coord);
  //     }
  //   }
  //
  //   console.dir(self.coordenadas);
  //   return self.coordenadas;
  //
  // }

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
