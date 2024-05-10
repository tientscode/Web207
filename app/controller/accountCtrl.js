app.controller('accountCtrl', function ($scope, $rootScope, $firebaseArray) {
    // Lấy tham chiếu đến "students" trong Realtime Database
    var studentsRef = firebase.database().ref('students');
    // Tạo một $firebaseArray để theo dõi và cập nhật dữ liệu
    $rootScope.students = $firebaseArray(studentsRef);
    $scope.account = function () {
        // Lấy dữ liệu từ các biến initial
        var updatedStudent = {
            $id: $rootScope.student.$id,
            username: $scope.initialUsername,
            fullname: $scope.initialFullname,
            email: $scope.initialEmail,
            schoolfee: $scope.initialSchoolfee,
            gender: $scope.initialGender,
            marks: $scope.initialmarks,
            birthday: $scope.initialBirthday
        };

        // Tìm sinh viên trong mảng Firebase dựa trên ID
        var studentToUpdate = $rootScope.students.$getRecord(updatedStudent.$id);

        // Cập nhật dữ liệu sinh viên
        studentToUpdate.username = updatedStudent.username;
        studentToUpdate.fullname = updatedStudent.fullname;
        studentToUpdate.email = updatedStudent.email;
        studentToUpdate.schoolfee = updatedStudent.schoolfee;
        studentToUpdate.gender = updatedStudent.gender;
        studentToUpdate.marks = updatedStudent.marks;
        studentToUpdate.birthday = updatedStudent.birthday;

        // Lưu thay đổi lên Firebase
        $rootScope.students.$save(studentToUpdate).then(function () {
            Swal.fire({
                icon: 'success',
                title: 'Cập Nhật thành công!',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });

        }).catch(function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Cập Nhật Thất Bại!',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });

        });
        console.log($rootScope.student);

    };



    $scope.otpSent = false; // để lưu xem otp đã gửi chưa
 




    $scope.sendOTP = function () {
        // Kiểm tra xem email và username đã được nhập vào chưa
        if (!$scope.initialEmail || !$scope.initialUsername) {
            Swal.fire({
                icon: 'error',
                title: 'Chưa nhập email hoặc username',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
            return;
        }
    
        var found = false;
        // Kiểm tra trùng lặp giữa username và email trong cùng một id
        angular.forEach($rootScope.students, function (student) {
            if (student.username === $scope.initialUsername && student.email === $scope.initialEmail) {
                found = true;
                return; // Thoát khỏi vòng lặp nếu tìm thấy trùng khớp
            }
        });
    
        if (!found) {
            Swal.fire({
                icon: 'error',
                title: 'Username và email không đúng',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
            return;
        }
    
        // Gửi OTP và các xử lý khác
        var email = $scope.initialEmail;
        let otp_val = Math.floor(Math.random() * 10000);
    
        let emailbody = `<h2>Your OTP is </h2>${otp_val}`;
        Email.send({
            SecureToken: "9fc3f97e-1dba-44b5-b0e3-81c872634bc6",
            To: email,
            From: "loclop3@gmail.com",
            Subject: "Email OTP using JavaScript",
            Body: emailbody,
        }).then(function() {
            Swal.fire({
                icon: 'success',
                title: 'Đã gửi OTP',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
            $scope.otpSent = true;
    
            // Hủy OTP sau 60 giây
            var interval = setInterval(function() {
                $scope.remainingTime--;
                $scope.$apply();
                if ($scope.remainingTime <= 0) {
                    clearInterval(interval);
                    $scope.timeExpired = true;
                }
            }, 1000); // Cập nhật mỗi giây
        }).catch(function(error) {
            console.error('Error sending email:', error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi khi gửi OTP',
                text: 'Vui lòng thử lại sau',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
        });
    };
    



    $scope.pass = function () {
        // Kiểm tra xem đã gửi OTP chưa
        if (!$scope.otpSent) {
            Swal.fire({
                icon: 'error',
                title: 'Thông báo',
                text: 'Otp không được để trống',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
        }

        var repass = {
            username: $scope.initialUsername,
            email: $scope.initialEmail,
            password: null
        };

        angular.forEach($rootScope.students, function (student) {
            if (student.username === repass.username || student.email === repass.email) {
                repass.password = student.password;
                return;
            }
        });

        if (repass.password !== null) {
            const email = repass.email;
            const otp_inp = document.getElementById('otp_inp');
            let otp_val = otp_inp.value;

            if (otp_val == "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Thông báo',
                    text: 'Vui lòng nhập mã OTP',
                    showConfirmButton: false,
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                    timer: 1600
                });
                return;
            }

            if (otp_val == otp_val) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mật khẩu của bạn là: ' + repass.password,
                    showConfirmButton: false,
                    closeOnClickOutside: false,
                    allowOutsideClick: false,
                    timer: 1600
                });
            } else {
                alert("Mã OTP không hợp lệ");
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Username hoặc email không tồn tại',
                showConfirmButton: false,
                closeOnClickOutside: false,
                allowOutsideClick: false,
                timer: 1600
            });
        }
    };








});
