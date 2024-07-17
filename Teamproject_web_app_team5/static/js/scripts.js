$(document).ready(function() {
  // 메뉴 박스 클릭 이벤트
  $('.menu-box').on('click', function() {
      const targetId = $(this).data('target');
      if (!targetId) return;

      $('.options-container').each(function() {
          if ($(this).attr('id') !== targetId) {
              $(this).hide();
          }
      });

      const optionsContainer = $('#' + targetId);
      if (optionsContainer.length > 0) {
          optionsContainer.toggle();
      }
  });

  // 연령대 선택 이벤트
  $('#age-select').on('change', function() {
      const selectedAge = $(this).val();
      showResult(`연령대 선택: ${selectedAge}`);
  });

  // 카테고리 선택 이벤트
  $('#cat-select').on('change', function() {
      const selectedCategory = $(this).val();
      showResult(`카테고리 선택: ${selectedCategory}`);
  });

  // 성별 선택 이벤트
  $('#sex-select').on('change', function() {
      const selectedSex = $(this).val();
      showResult(`성별 선택: ${selectedSex}`);
  });

  // 결과 보기 함수
  function showResult(resultText) {
      $('#resultContainer').show();
      $('#result').html(resultText);
  }

  // 제출 버튼 클릭 이벤트
  $('#submitBtn').on('click', function() {
      $('.alert').show();
      $('#resultContainer').hide();
  });

  // 뒤로 가기 버튼 클릭 이벤트
  $('#backButton').on('click', function() {
      $('#resultContainer').hide();
  });

  // 검색 입력 이벤트
  $('#search').on('input', function() {
      const searchTerm = $(this).val().toLowerCase();
      $('#postList tr').each(function() {
          const title = $(this).children('td:eq(1)').text().toLowerCase();
          const content = $(this).children('td:eq(2)').text().toLowerCase();
          if (title.includes(searchTerm) || content.includes(searchTerm)) {
              $(this).show();
          } else {
              $(this).hide();
          }
      });
  });

  // 초기 상태로 모든 collapse 닫기
  $('.collapse').collapse('hide');
});
