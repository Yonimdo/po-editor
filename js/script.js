

var myApp = angular.module('myApp', []);

myApp.controller('Values', ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {
    $scope.changeableText = { value: "" };
    $scope.contactText = { value: "" };
    $scope.immutableText = { value: "" };
    $scope.curser = { value: "" };
    $scope.s = [];
    $scope.values = [];
    $scope.keys = {};
    $scope.fileName = ""
    $scope.files = { value: "" };
    $scope.upload_value = { file: "" }

    function syncFile(file_String){
        let list = file_String.split("\n\n");
        return list.map((i, index) => {
            let item = {};
            item.raw = i;
            item.msgid = ((/(msgid\s.+"\n)/g).exec(i) || [''])[0];
            item.msgstr = ((/(msgstr\s.+")/g).exec(i) || [''])[0];
            item.notes = item.raw.replace(item.msgstr,"").replace(item.msgid,"") 
            item.msgid = ((/msgid\s"(.+)"/g).exec(item.msgid) || [false,false])[1];
            item.msgstr = ((/msgstr\s"(.+)"/g).exec(item.msgstr) || ['','']) [1];    
            $scope.upload_value.file = Math.round(index / list.length * 100);
            return item;
        });
    };
    function listToFile(s){
        let output= '';
        s.map(item => {
            output = `${output}\n\n${item.raw.replace(
                ((/(msgstr\s.+")/g).exec(item) || ['msgstr \"\"'])[0],
                `msgstr \"${item.msgstr}\"`
            )}`
        });
        return output;
    };

    function updateFile(list){
        $scope.values = list;
        $scope.$apply();
    };

    $scope.download = function () {
        result = listToFile($scope.values);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(result));
        element.setAttribute('download', $scope.fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    };

    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    $scope.handleFiles = function(jqur) {
        $scope.fileName = jqur[0].files[0].name;
        let reader = new FileReader()
        reader.readAsText(jqur[0].files[0])
        reader.onloadend = function() {
            updateFile(syncFile(reader.result))
        }
    }
}]);
