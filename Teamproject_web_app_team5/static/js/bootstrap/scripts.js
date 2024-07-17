document.addEventListener("DOMContentLoaded", function () {
    // Handle menu box click events
    const menuBoxes = document.querySelectorAll(".menu-box");
    menuBoxes.forEach(function (menuBox) {
        menuBox.addEventListener("click", function () {
            const targetId = menuBox.getAttribute("data-target");
            if (!targetId) return;

            const optionsContainer = document.getElementById(targetId);
            if (optionsContainer) {
                toggleOptions(optionsContainer);
                showResultContainer(menuBox.nextElementSibling); ;
            }
        });
    });

    // Handle option select events
    const ageSelect = document.getElementById("age-select");
    const catSelect = document.getElementById("cat-select");
    const sexSelect = document.getElementById("sex-select");
    const resultContainer = document.getElementById("resultContainer");
    const backButton = document.getElementById("backButton");
    const submitBtn = document.getElementById("submitBtn");

    // ageSelect.addEventListener("change", function () {
    //     const selectedAge = ageSelect.value;
    //     showResult(`연령대 선택: ${selectedAge}`);
    // });

    catSelect.addEventListener("change", function () {
        const selectedCategory = catSelect.value;
        showResult(`카테고리 선택: ${selectedCategory}`);
    });

    sexSelect.addEventListener("change", function () {
        const selectedSex = sexSelect.value;
        showResult(`성별 선택: ${selectedSex}`);
    });

    // Function to display result
    function showResult(resultText) {
        resultContainer.style.display = "block";
        document.getElementById("result").innerHTML = resultText;
    }

    // submit button - publisher_servidce
    backButton.addEventListener("click", function () {
        resultContainer.style.display = "none";
    })

    // Back button - 
    backButton.addEventListener("click", function () {
        resultContainer.style.display = "none";
    });
});


// inquiry.html 부분
document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const postList = document.getElementById('postList');
    const editIndex = document.getElementById('editIndex').value;

    if (editIndex === '') {
      // New post
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <th scope="row">${postList.children.length + 1}</th>
        <td>${title}</td>
        <td>${content}</td>
        <td>${new Date().toLocaleString()}</td>
        <td>
          <button class="btn btn-warning btn-sm edit-btn">수정</button>
          <button class="btn btn-danger btn-sm delete-btn">삭제</button>
        </td>
      `;
      postList.appendChild(newRow);
    } else {
      // Edit post
      const row = postList.children[editIndex];
      row.children[1].textContent = title;
      row.children[2].textContent = content;
      row.children[3].textContent = new Date().toLocaleString();
      document.getElementById('editIndex').value = '';
    }

    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
  });

  document.getElementById('postList').addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-btn')) {
      const row = event.target.parentElement.parentElement;
      const index = Array.from(row.parentElement.children).indexOf(row);
      document.getElementById('title').value = row.children[1].textContent;
      document.getElementById('content').value = row.children[2].textContent;
      document.getElementById('editIndex').value = index;
    }

    if (event.target.classList.contains('delete-btn')) {
      event.target.parentElement.parentElement.remove();
    }
  });

  document.getElementById('search').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('#postList tr');

    rows.forEach(row => {
      const title = row.children[1].textContent.toLowerCase();
      const content = row.children[2].textContent.toLowerCase();
      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

//customer_info.html 부문