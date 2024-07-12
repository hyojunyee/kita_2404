document.addEventListener('DOMContentLoaded', function() {
    // 요소들을 가져옵니다.
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const closeButtons = document.querySelectorAll('.close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userGreeting = document.getElementById('user-greeting');

    const registerButton = document.createElement('button');
    registerButton.textContent = '회원가입';
    registerButton.id = 'register-button';
    document.getElementById('login-status').insertBefore(registerButton, loginButton);

    // 로그인 모달 표시 및 숨김
    loginButton.onclick = function() {
        loginModal.style.display = "block";
    }

    // 모든 닫기 버튼에 이벤트 리스너 추가
    closeButtons.forEach(button => {
        button.onclick = function() {
            loginModal.style.display = "none";
            registerModal.style.display = "none";
        }
    });

    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        } else if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    }

    // 로그인 폼 제출 이벤트 처리
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginModal.style.display = "none";
                loginButton.style.display = "none";
                logoutButton.style.display = "block";
                userGreeting.textContent = `안녕하세요, ${username}님!`;
            } else {
                alert('로그인 실패: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('로그인 중 오류가 발생했습니다.');
        });
    }

    // 로그아웃 버튼 클릭 이벤트 처리
    logoutButton.onclick = function() {
        fetch('/logout', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loginButton.style.display = "block";
                logoutButton.style.display = "none";
                userGreeting.textContent = "";
            } else {
                alert('로그아웃 실패: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('로그아웃 중 오류가 발생했습니다.');
        });
    }

    // 회원가입 모달 표시
    registerButton.onclick = function() {
        registerModal.style.display = "block";
    }

    // 회원가입 폼 제출 이벤트 처리
    registerForm.onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('회원가입이 완료되었습니다. 로그인해주세요.');
                registerModal.style.display = "none";
            } else {
                alert('회원가입 실패: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('회원가입 중 오류가 발생했습니다.');
        });
    }
});
