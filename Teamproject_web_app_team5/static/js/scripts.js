document.addEventListener("DOMContentLoaded", function () {
    // Handle menu box click events
    const menuBoxes = document.querySelectorAll(".menu-box");
    const optionsContainers = document.querySelectorAll(".options-container");

    menuBoxes.forEach(function (menuBox) {
        menuBox.addEventListener("click", function () {
            const targetId = menuBox.getAttribute("data-target");
            if (!targetId) return;

            const optionsContainer = document.getElementById(targetId);
            if (optionsContainer) {
              optionsContainers.forEach(function (container) {
                if (container.id !== targetId) {
                    container.style.display = "none";
                }
              });
              const isVisible = optionsContainer.style.display === "block";
              optionsContainer.style.display = isVisible ? "none" : "block";
            }
        });
    });

    // Handle option select events
    const ageSelect = document.getElementById("age-select");
    const catSelect = document.getElementById("cat-select");
    const sexSelect = document.getElementById("sex-select");
    const resultContainer = document.getElementById("resultContainer");
    const backButton = document.getElementById("backButton");
      
    // Function to display result
    function showResult(resultText) {
        resultContainer.style.display = "block";
        document.getElementById("result").innerHTML = resultText;
    }


    // Function to toggle options container
    function toggleOptions(container) {
      const isVisible = container.style.display === "block";
      container.style.display = isVisible ? "none" : "block";
  }
});


// publisher_service 부분
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];
});