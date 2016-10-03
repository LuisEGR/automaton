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
      this.transiciones.push(transition);
      return this.funcionTransicion[estado][entrada];
  }

  this.esFinal = function(estado){
    return (this.estadosF.indexOf(estado) !== -1);
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
    if(angular.isUndefined(estado)) estado =  this.estadoI;//estado inicial
    if(cadena.length == 1) {
      this.totalFinales += this.contarFinales(this.getDestinos(estado, cadena));
      var res = {};
      res[cadena] =  this.getDestinos(estado, cadena);
      return res;
    }
    var estadosNuevos = this.getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
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

}
