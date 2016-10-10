/* Implementación de la clase automata */
function Automata(struct){
  var self = this;
  this.estados = struct.q;
  this.alfabeto = struct.e;
  this.estadoI = struct.s;
  this.estadosF = struct.f;
  this.funcionTransicion = struct.d;
  this.transiciones = struct.d_;
  this.funcionInversa = struct.di;
  // this.transiciones = [];
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
  // this.validarPalabra = function(cadena,estado){
  //   var caminos = {};
  //   if(angular.isUndefined(estado)){
  //     self.totalFinales = 0;
  //     self.transiciones.length = 0;
  //     estado =  this.estadoI;//estado inicial
  //   }
  //   if(cadena.length == 1) {
  //     self.totalFinales += self.contarFinales(this.getDestinos(estado, cadena));
  //     //self.agregarFinales(this.getDestinos(estado, cadena));
  //     var res = {};
  //     res[cadena] =  self.unir(self.getDestinos(estado, cadena));
  //     return res;
  //   }
  //   var estadosNuevos = self.getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
  //   if(estadosNuevos == false){//Si no tiene destinos
  //     caminos[cadena.charAt(0)] = 'ε';
  //     return caminos;
  //   }
  //
  //   angular.forEach(estadosNuevos, function(v,k){
  //     var first =  cadena.charAt(0);
  //     var resto = cadena.substr(1, cadena.length);
  //     if(angular.isUndefined(caminos[first])) caminos[first] = [];
  //     caminos[first][v] = self.validarPalabra(resto, v)//Valida el resto de la palabra de forma recursiva
  //   });
  //   return caminos;
  // }
  //








  this.validarPalabra = function(cadena,estado){
    var caminos = {};
    var res = {};
    if(angular.isUndefined(estado)){
      self.totalFinales = 0;
      self.transiciones.length = 0;
      estado =  this.estadoI;//estado inicial
    }
    console.log("Validando palabra '"+cadena+"' desde el estado '"+estado+"' ");
    var estadosNuevos = self.getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
    if(estadosNuevos == false){//Si no tiene destinos
      if(cadena.charAt(0) != 'E'){
        console.log("1.Validando en '"+estado+"'con E"+cadena);
        console.log("cadena long: "+cadena.length);
        caminos = self.validarPalabra('E'+cadena, estado);
      }else{
        caminos[cadena.charAt(0)] = estado;
        f = self.getDestinos(estado, cadena.charAt(0));
        console.log("Hey "+f);
        console.log("cadena long: "+cadena.length);
        if(cadena.length >= 2){
            caminos[cadena.charAt(0)] = 'ε';
        }
      }
    }else{
      angular.forEach(estadosNuevos, function(estado){
        var first =  cadena.charAt(0);
        var resto = cadena.substr(1, cadena.length);
        console.log("Cadena: "+ cadena);
        console.log("First: "+first);
        console.log("Resto: "+resto);
        if(angular.isUndefined(caminos[first])) caminos[first] = [];
        if(resto.length > 0){
          console.log("2.Validando en '"+estado+"'con "+resto);
          caminos[first][estado] = self.validarPalabra(resto, estado)//Valida el resto de la palabra de forma recursiva
        }else{
          console.log("3.Validando en '"+estado+"'con E");
          caminos[first][estado] = self.validarPalabra('E', estado);//Valida el resto de la palabra de forma recursiva


        }

      });
    }

    return caminos;
}


  self.simplificarTransiciones = function(){
    var newTransitions = [];
    for(var i = 0; i < self.transiciones.length; i++){
      var fT = self.transiciones[i].split(',');
      if(fT[0] == fT[2]){//Si va hacia si mismo
        newTransitions.push(fT[1]);
      }
    }
  }



  self.draw = function(){

    // Create a new directed graph
    // var g = new dagreD3.graphlib.Graph().setGraph({});
    var g = new dagreD3.graphlib.Graph().setGraph({rankdir: 'LR'});

    // States and transitions from RFC 793
    var estados = self.estados;
    estados.forEach(function(estado) {
      g.setNode(estado, { label: estado,shape: "circle", style:"fill:#fff;stroke-width:1px; stroke:#333" });
    });

    for(var i = 0; i < self.transiciones.length; i++){
      if(self.transiciones[i] != ""){
        var fT = self.transiciones[i].split(',');
        var actual = fT[0];
        var entrada = fT[1];
        var destino = fT[2];
        g.setEdge(actual, destino, {label: entrada, lineInterpolate: 'basis' });
      }
    }

    // Set some general styles
    // g.nodes().forEach(function(v) {
    //   var node = g.node(v);
    //   node.rx = node.ry = 10;
    // });

    // Add some custom colors based on state
    g.node(self.estadoI).style = "fill: #ff9a7b;stroke-width:1px; stroke:#333";
    self.estadosF.forEach(function(estado){
      g.node(estado).style = "fill: #37decf;stroke-width:1px; stroke:#333";
    });

    // g.node('ESTAB').style = "fill: #7f7";

    var svg = d3.select("svg"),
        inner = svg.select("g");

    // Set up zoom support
    var zoom = d3.behavior.zoom().on("zoom", function() {
          inner.attr("transform", "translate(" + d3.event.translate + ")" +
                                      "scale(" + d3.event.scale + ")");
        });
    svg.call(zoom);

    // Create the renderer
    var render = new dagreD3.render();


    // Run the renderer. This is what draws the final graph.
    render(inner, g);

    // Center the graph
    var initialScale =1;
    zoom
      .translate([(svg.attr("width") - g.graph().width * initialScale) / 2, 20])
      .scale(initialScale)
      .event(svg);
    svg.attr('height', g.graph().height * initialScale + 40);
  }



    self.draw();

}


function _flat(target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '→'
  var maxDepth = opts.maxDepth
  var output = {}

  function step(object, prev, currentDepth) {
    currentDepth = currentDepth ? currentDepth : 1
    Object.keys(object).forEach(function(key) {
      var value = object[key]
      var isarray = opts.safe && Array.isArray(value)
      var type = Object.prototype.toString.call(value)

      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      var newKey = prev
        ? prev + delimiter + key
        : key

      if (!isarray && isobject && Object.keys(value).length &&
        (!opts.maxDepth || currentDepth < maxDepth)) {
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = value
    })
  }

  step(target)

  return output
}
