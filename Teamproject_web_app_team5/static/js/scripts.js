document.addEventListener("DOMContentLoaded", function () {
    const addTaskButton = document.getElementById("addTaskButton");
    const cancelButton = document.getElementById("cancelButton");
    const addTaskForm = document.getElementById('addTaskForm');
    const taskList = document.getElementById("task-list");

    addTaskButton.addEventListener("click", function () {
        addTaskForm.style.display = "block";
        cancelButton.style.display = "inline-block";
        addTaskButton.style.display = "none";
    });

    cancelButton.addEventListener("click", function () {
        addTaskForm.style.display = "none";
        cancelButton.style.display = "none";
        addTaskButton.style.display = "inline-block";
    });

    addTaskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(addTaskForm);
        fetch('/inquiry', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchTasks();  // 태스크 목록 새로고침
                addTaskForm.reset();  // 폼 초기화
                addTaskForm.style.display = 'none';
                addTaskButton.style.display = 'inline-block';
                cancelButton.style.display = 'none';
                alert('등록 성공!');  // 등록 성공 메시지 추가
            } else {
                alert('등록 실패!');  // 실패 시 메시지 추가
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('등록 중 오류가 발생했습니다.');
        });
    });

    function fetchTasks() {
        fetch("/tasks")
            .then((response) => response.json())
            .then((tasks) => {
                taskList.innerHTML = '';  // 기존 목록 초기화
                tasks.forEach((task) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<strong>${task.title}</strong><br>
                                    ${task.contents}<br>
                                    등록일: ${task.input_date}<br>
                                    마감일: ${task.due_date}`;

                    const editLink = document.createElement("a");
                    editLink.href = `/edit/${task.id}`;
                    editLink.textContent = " Edit";
                    li.appendChild(editLink);

                    const deleteLink = document.createElement("a");
                    deleteLink.href = `/delete/${task.id}`;
                    deleteLink.textContent = " Delete";
                    li.appendChild(deleteLink);

                    taskList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
                alert('태스크 목록을 불러오는 중 오류가 발생했습니다.');
            });
    }

    fetchTasks();  // 페이지 로드 시 태스크 목록 가져오기
});
