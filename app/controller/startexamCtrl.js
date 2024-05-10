app.controller('startexamCtrl', function ($scope, $rootScope, $firebaseArray, $routeParams, $http, $interval) {
    var studentsRef = firebase.database().ref('students');
    $rootScope.students = $firebaseArray(studentsRef);



    console.log("đang thi môn " + $routeParams.id)

    $rootScope.subjects.forEach(ar => {
        if (ar.Id == $routeParams.id) {
            $scope.subject = angular.copy(ar);// copy dữ liệu từ mảng subjects cho mảng subject theo id trên và trả về cho mảng subject 
            return;
        }
    });

    $http.get('db/Quizs/' + $routeParams.id + '.js').then(function (response) {
        $scope.questions = response.data;
        console.log($scope.questions.length);
        $scope.questions.sort(function () { return 0.5 - Math.random(); });
        // Lấy ra 10 câu hỏi đầu tiên
        $scope.randomQuestions = $scope.questions.slice(0, 10);
        $scope.questions = $scope.randomQuestions;
        console.log($scope.questions)
    });
    $scope.testMark = 0; // điểm 
    $scope.indexQ = 0; //vị trí câu hiện tại
    $scope.timer = 900; // thời gian làm bài thi
    $scope.traloi = [];


    $scope.next = function () {
        $scope.indexQ++
        if ($scope.indexQ > $scope.questions.length - 1) {
            $scope.indexQ = 0
        }
    }



    $scope.prev = function () {
        $scope.indexQ--
        if ($scope.indexQ < 0) {
            $scope.indexQ = 0
        }
    }

    $scope.finish = function () {
        Swal.fire({
            title: "Thông Báo",
            text: "Bạn có muốn kết thúc bài thi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng, Tôi Muốn Kết Thúc"
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.timer = 0
            }

        });


    }

    var stop = $interval(function () {
        if ($scope.timer > 0) {// nếu thời gian >0 thì giảm xuống
            $scope.timer -= 1;
        } else if ($scope.timer == 0) { //nếu thời gian ==0 thì kết thúc và lưu kết quả

            console.log($scope.traloi)
            $scope.traloi.forEach((tl, i) => {
                $scope.questions.forEach((da, j) => {
                    if (i == j && tl.Answer == da.AnswerId) {
                        $scope.testMark += da.Marks;
                    }

                });
            });
            var studenthistory = $rootScope.students.$getRecord($rootScope.student.$id); //tìm sinh viên dựa theo id trong students

            if (!angular.isObject(studenthistory.history)) {
                studenthistory.history = []
            }

            var historyS = {
                // Các thuộc tính khác của lịch sử bài thi
                Name: $scope.subject.Name,
                poin: $scope.testMark,
                testDateTime: new Date().toLocaleString('vi-VN'),
            };
            studenthistory.history.push(historyS);

            studenthistory.marks = parseInt(studenthistory.marks) + parseInt($scope.testMark);
            $rootScope.students.$save(studenthistory)
            Swal.fire({
                icon: 'success',
                title: 'Điểm của bạn là ' + $scope.testMark,
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });


            window.location.href = "#!exam/" + $scope.subject.Id;
            $interval.cancel(stop);
        }
    }, 1000);



});
