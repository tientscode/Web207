app.controller('historyexamCtrl', function ($scope, $rootScope, $firebaseArray) {
    var studentsRef = firebase.database().ref('students');
    $rootScope.students = $firebaseArray(studentsRef);
});