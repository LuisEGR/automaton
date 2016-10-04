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

  $scope.processForm = function(){
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

    $scope.automata = new Automata({
      q: $scope.automataForm.q.split(','),
      e: $scope.automataForm.e.split(','),
      s: $scope.automataForm.s,
      f: $scope.automataForm.f.split(','),
      d: Δ
    });

    console.dir($scope.automata);
    $scope.automata.print(); // Consola
    $scope.automata.dibujar('automataPlot');

  }


  $scope.getDatosTextarea = function(){
    var datos = $('#automata').val().split('\n');
    $scope.automataForm.q = datos[0];
    $scope.automataForm.e = datos[1];
    $scope.automataForm.s = datos[2];
    $scope.automataForm.f = datos[3];
    $scope.automataForm.d = datos.slice(4,datos.length).join('\n');
    console.log(datos);
    //$scope.processForm();
  }



  $scope.showTipo = function(estado){//inicial y final

    if(($scope.automataForm.f.indexOf(estado) !== -1)) return "*";
    if(($scope.automataForm.s == estado)) return "→";
  }

  // getCoordenadas = function(estado){
  //   console.log($('#e_'+estado));
  // }
  //
  // getAllCoordenadas = function(){
  //   $scope.coordenadas.length = 0;
  //   angular.forEach($scope.automata.estados, function(estado){
  //     getCoordenadas(estado);
  //     //$scope.coordenadas.push()
  //   });
  // }



  $scope.validar = function(){
    $scope.transiciones.length = 0;

    $scope.resultado = $scope.automata.validarPalabra($scope.cadena);
    $scope.totalFinales = $scope.automata.totalFinales;
    $scope.transiciones = $scope.automata.transiciones;
    $scope.automata.dibujar('automataPlot');
    // $scope.resultado = validarPalabra($scope.cadena);
    console.dir($scope.resultado);
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
