'use strict';

/**
 * @ngdoc directive
 * @name appApp.directive:ngMiniEditor
 * @description
 * # ngMiniEditor
 * Created by yh on 15-1-8.
 */
angular.module('ngminieditor',[])
  .controller('editorSetCtr',['$scope',function($scope){
       var Ctr=this,
        editors=Ctr.editors=$scope.editors=[];
        Ctr.addEditors=function(editor){
            editors.push(editor);
        }
        Ctr.removeEditors=function(editor){
            var index = editors.indexOf(editor);
            editors.splice(index, 1);
        }

        $scope.addMiniEditor=function(){
          var newEditoor=  {
                'type':0,
                'editcontents':[]
            }

            $scope.minieditors.push(newEditoor);
        }
        $scope.translateData=function(){
            console.log($scope.minieditors);
        }

}])
 .directive('editorset',function(){
     return {
         templateUrl: 'views/template/editorset.html',
         restrict: 'E',
         replace: true,
         transclude:true,
         controller:'editorSetCtr'
      }
 })
 .directive('minieditor', function () {
    return {
      templateUrl: 'views/template/minieditor.html',
      require:'^editorset',
      restrict: 'E',
      replace: true,
      transclude:true,
      controller:function($scope){
          var ctr=this;
          var editcontents=ctr.editcontents=$scope.minieditor.editcontents;
          ctr.up=function(index){
              if(index==0){
                  return;
              }
              var tem=editcontents[index];
              editcontents[index]=editcontents[index-1];
              editcontents[index-1]=tem;
              //$scope.$digest();
          }
          ctr.down=function(index){
              if(index==editcontents.length-1){
                  return;
              }
              var tem=editcontents[index];
              editcontents[index]=editcontents[index+1];
              editcontents[index+1]=tem;
          }
          ctr.remove=function(index){
              editcontents.splice(index);
          }
          var creatData=creatData||{};
          creatData.image=function(){

          }
          creatData.text=function(){
                var obj={'type':'text','value':''};
                return function(){
                    obj.value=arguments[0];
                    return obj;
                }
          }
          creatData.shortDesc=function(){
              var obj={'type':'shortDesc','value':''};
              return function(){
                  obj.value=arguments[0];
                  return obj;
              }
          }

          creatData.factory=function(type){
              return new creatData[type];
          }
          $scope.selects=[
              {'name':'替换','value':0},
              {'name':'向下插入','value':1},
              {'name':'向上插入','value':2}
          ]
          $scope.creatContent=function(type,value){
              if(type=='shortDesc'){
                  editcontents.unshift(creatData.factory(type)(value));
              }else{
                  editcontents.push(creatData.factory(type)(value));
              }
              $scope.addType=4;
          }
    }}
  })
    .directive('editcontent',function(){
        return {
            templateUrl: 'views/template/editcontent.html',
            require:'^minieditor',
            restrict: 'E',
            transclude:true,
            replace: true,
            controller:function($scope,$sce){
                $scope.editcontent.value=$sce.trustAsHtml($scope.editcontent.value);

            },
            compile: function(elm, attrs, transclude) {
                return function contentLink($scope,elem,attr,editorsetCtr){
                    $scope.up=function(index){
                        editorsetCtr.up(index);
                    }
                    $scope.down=function(index){
                        editorsetCtr.down(index);
                    }
                    $scope.remove=function(index){
                        editorsetCtr.remove(index);
                    }
                }
            }
        }
    })

