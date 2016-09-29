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


  //Checa si existe un destino con un estado y una entrada, devuelve 'error' si no
  $scope.check = function(est, ent){
    var est = $scope.est;
    var ent = $scope.ent;
    if(angular.isUndefined($scope.automataWork.d)) res = 'ERROR_NO_ESTADO';   $scope.resultCheck = res;
    if(angular.isUndefined($scope.automataWork.d[est])) res = 'ERROR_NO_ESTADO';  $scope.resultCheck =  res;
    var res = $scope.automataWork.d[est][ent] || 'ERROR_NO_TRANSICION';
    $scope.resultCheck = res;
    //return res;
    // console.log("je");
  }

  //document.getElementById('files').addEventListener('change', handleFileSelect, false);


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
