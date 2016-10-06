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
  $scope.transiciones = [];
  $scope.totalFinales = 0;
  $scope.automata = {};
  $scope.coordenadas = [];

  $scope.$watch('automataForm', function(o, n){
    if(o!=n){
      $scope.processForm();
      $scope.validar();
    }
  },true);


  //Funciòn para procesar el formulario y crear el objeto de Automata con los datos procesados.
  $scope.processForm = function(){
    //Primero creo la función de transición como un objeto de esta estructura:
    /*
    {
          "0": {
               "a": [
                    "0",
                    "1"
               ],
               "b": [
                    "0"
               ]
          },
          "1": {
               "b": [
                    "2"
               ]
          }
     },
     Donde del estado 0 con a manda a 0,1... etc
     */
    var Δ = {};
    angular.forEach( $scope.automataForm.d.split('\n'), function(v,k){//Por cada transición
      var δ = v.split(','); // [a,1,d]
      angular.forEach(  $scope.automataForm.q,function(v2,k2){//por cada estado
        // var r = {};
        if(δ[0] == v2){
          if(angular.isUndefined(Δ[v2])) Δ[v2] = {};
          if(angular.isUndefined(Δ[v2][δ[1]])) Δ[v2][δ[1]] = [];//arreglo de estados destino, para los AFN
          Δ[v2][δ[1]].push(δ[2]);
        }
      });
    });

    var Δi = {};
    angular.forEach( $scope.automataForm.d.split('\n'), function(v,k){//Por cada transición
      var δ = v.split(',').reverse(); // [a,1,d] -> [d,1,a]
      angular.forEach(  $scope.automataForm.q,function(v2,k2){//por cada estado
        // var r = {};
        if(δ[0] == v2){
          if(angular.isUndefined(Δi[v2])) Δi[v2] = {};
          if(angular.isUndefined(Δi[v2][δ[1]])) Δi[v2][δ[1]] = [];//arreglo de estados destino, para los AFN
          Δi[v2][δ[1]].push(δ[2]);
        }
      });
    });

    //Creo un nuevo automata con los datos ya extraidos
    $scope.automata = new Automata({
      q: $scope.automataForm.q.split(','),
      e: $scope.automataForm.e.split(','),
      s: $scope.automataForm.s,
      f: $scope.automataForm.f.split(','),
      d: Δ,
      di: Δi//inversa
    });
    //console.dir($scope.automata);
    $scope.automata.print(); // Consola
    // $scope.automata.dibujar('automataPlot');
    $scope.coordenadas = $scope.automata.generarCoordenadas();

  }

  // $scope.check = function(){
  //   $scope.resultCheck = $scope.automata.getDestinosInversos($scope.est, $scope.ent);
  // }

  //Datos del textarea al formulario
  $scope.getDatosTextarea = function(){
    var datos = $('#automata').val().split('\n');
    $scope.automataForm.q = datos[0];
    $scope.automataForm.e = datos[1];
    $scope.automataForm.s = datos[2];
    $scope.automataForm.f = datos[3];
    $scope.automataForm.d = datos.slice(4,datos.length).join('\n');
  }


  //Obtengo el simbolo del tipo (inicial, final o inicial y final)
  $scope.showTipo = function(estado){//inicial y final
    if(($scope.automataForm.f.indexOf(estado) !== -1) && ($scope.automataForm.s == estado)) return "*→";
    if(($scope.automataForm.f.indexOf(estado) !== -1)) return "*";
    if(($scope.automataForm.s == estado)) return "→";
  }

  //Comprobar si el camino es válido
  $scope.isValidPath = function(path){
    return $scope.automata.esFinal(path.charAt(path.length-1));
  }

  //Validar la cadena (Desde el objeto de automata)
  $scope.validar = function(){
    if(angular.isUndefined($scope.cadena) || $scope.cadena.length == 0) return;
    $scope.transiciones.length = 0;

    $scope.resultado = $scope.automata.validarPalabra($scope.cadena);
    $scope.caminos = $scope.automata.aplanar($scope.resultado);
    $scope.totalFinales = $scope.automata.totalFinales;

  }


}]);


var openFile = function(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    var node = document.getElementById('output');
    $('#automata').val(text);
    console.log(reader.result.substring(0, 200));
  };
  reader.readAsText(input.files[0]);
};
