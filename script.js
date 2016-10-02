var App = angular.module('Automatas', []);

App.controller('automatasController', ['$scope', function($scope){
  $scope.test = "Hola";
  $scope.automataForm = { q: '', e: '',s: '', f: '',  d: '' };
  $scope.automataWork = {};
  $scope.archivo = "";
  $scope.fT = {};
  $scope.ent = "";
  $scope.est = "";
  $scope.resultCheck = "";
  $scope.resultado = {};
  $scope.totalFinales = 0;
  $scope.processForm = function(){
    angular.copy($scope.automataForm, $scope.automataWork);
    $scope.automataWork.q = $scope.automataWork.q.split(',');
    $scope.automataWork.e = $scope.automataWork.e.split(',');
    $scope.automataWork.f = $scope.automataWork.f.split(',');
    $scope.automataWork.d = $scope.automataWork.d.split('\n');
    var Δ = {};
    angular.forEach($scope.automataWork.d, function(v,k){//Por cada transición
      var δ = v.split(','); // [a,1,d]
      angular.forEach($scope.automataWork.q,function(v2,k2){//por cada estado
        // var r = {};
        if(δ[0] == v2){
          if(angular.isUndefined(Δ[v2])) Δ[v2] = {};
          if(angular.isUndefined(Δ[v2][δ[1]])) Δ[v2][δ[1]] = [];//arreglo de estados destino, para los AFN
          Δ[v2][δ[1]].push(δ[2]);
        }
      });
    });
    console.log(Δ);
    $scope.automataWork.d = Δ;
  }

  $scope.textChange = function(){
    console.log("cambio!");
  }
  //Checa si existe un destino con un estado y una entrada, devuelve 'error' si no
  $scope.check = function(est, ent){
    var est = $scope.est;
    var ent = $scope.ent;
    if(angular.isUndefined($scope.automataWork.d)) res = 'ERROR_NO_ESTADO';   $scope.resultCheck = res;
    if(angular.isUndefined($scope.automataWork.d[est])) res = 'ERROR_NO_ESTADO';  $scope.resultCheck =  res;
    var res = $scope.automataWork.d[est][ent] || 'ERROR_NO_TRANSICION';  $scope.resultCheck = res;
    //return res;
    // console.log("je");
  }

  //document.getElementById('files').addEventListener('change', handleFileSelect, false);
  $scope.getDatosTextarea = function(){
    var datos = $('#container_text').val().split('\n');
    $scope.automataForm.q = datos[0];
    $scope.automataForm.e = datos[1];
    $scope.automataForm.s = datos[2];
    $scope.automataForm.f = datos[3];
    $scope.automataForm.d = datos.slice(4,datos.length).join('\n');
    console.log(datos);
    $scope.processForm();
  }

  function getDestinos(estado, entrada){
    console.log("Get destino: " + estado + "("+entrada+")");
    if(angular.isUndefined($scope.automataWork.d)) return false;
    if(angular.isUndefined($scope.automataWork.d[estado])) return false;
    if(angular.isUndefined($scope.automataWork.d[estado][entrada])) return false;
    return {hojas: $scope.automataWork.d[estado][entrada]};
  }
  function contarFinales(arreglo_estados){
    var total = 0;
    angular.forEach(arreglo_estados, function(estado){
      if(esFinal(estado)){//si existe
        total+=1;
      }
    });
    return total;
  }
  function esFinal(estado){
    return ($scope.automataWork.f.indexOf(estado) !== -1);
  }

  $scope.validar = function(){
    $scope.resultado = validarPalabra($scope.cadena);
    console.dir($scope.resultado);
  }
  //validar palabra
  //ej p = abcc
  $scope.totalFinales = 0;
  validarPalabra = function(cadena,estado){
    console.log("doValidar");
    if(angular.isUndefined(estado)) estado = $scope.automataWork.s;//estado inicial
    //if(angular.isUndefined(totalFinales)) totalFinales = 0;//estado inicial
    //if(cadena.length == 0) return cadena;
    if(cadena.length == 1) {
      $scope.totalFinales += contarFinales(getDestinos(estado, cadena));
      return getDestinos(estado, cadena);
    }
    var estadosNuevos = getDestinos(estado, cadena.charAt(0));//Tomo el primer caracter y lo mando como entrada
    var arbol =  {};
    var caminos = [];
    //totalFinales += contarFinales(caminos);
    //arbol[estado] = {caminos: []};
    angular.forEach(estadosNuevos.hojas, function(v,k){
      console.log("Estado nuevo: " + v);
      caminos.push(validarPalabra(cadena.substr(1, cadena.length), v));
      //arbol[estado].caminos.push(validarPalabra(cadena.substr(1, cadena.length), v) );
    });
    arbol.ramas = caminos;
    return arbol;
  }

}]);


var openFile = function(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    var node = document.getElementById('output');
    $('#container_text').val(text);
    console.log(reader.result.substring(0, 200));
  };
  reader.readAsText(input.files[0]);
};
