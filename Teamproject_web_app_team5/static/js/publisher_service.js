var bookData = [];  

$(document).ready(function() {
    $.ajax({
        url: 'static/yes24.csv', 
        dataType: 'text',
        success: function(data) {
            console.log("CSV data loaded successfully");
            bookData = parseData(data);
            console.log("Parsed book data:", bookData);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error loading CSV:", textStatus, errorThrown);
            alert("데이터 로딩 중 오류가 발생했습니다.");
        }
    });

    
    // 옵션 선택 이벤트 핸들링
    $('#age-select').on('change', function() {
        showResult(`연령대 선택: ${this.value}`);
        generateInsights(this.value);
        console.log()
    });

    $('#cat-select').on('change', function() {
        showResult(`카테고리 선택: ${this.value}`);
        generateInsights(this.value);
    });

    $('#sex-select').on('change', function() {
        showResult(`성별 선택: ${this.value}`);
        generateInsights(this.value);
    });

});

// 모달 결과창 생성
function showResult(resultText) {
    $('#resultContainer').show();
    $('#result').text(resultText);
}

// 모달 닫기 버튼 클릭 시 이벤트 핸들링
$('.close').on('click', function() {
    $('#myModal').hide();  // 모달 숨기기
    location.reload();     // 페이지 새로고침
});

function parseData(data) {
    var lines = data.trim().split('\n');
    var headers = lines[0].split(',');
    var parsedData = [];

    for (var i = 1; i < lines.length; i++) {
        var columns = lines[i].split(',');
        if (columns.length === headers.length) {
            var book = {
                Year: columns[0],
                Month: columns[1],
                Category: columns[2],
                Title: columns[3],
                Author: columns[4],
                Publisher: columns[5],
                Price: columns[6],
                Publish_Date: columns[7],
                Sales_Index: parseInt(columns[8]),
                Rating: parseFloat(columns[9]),
                Pages: parseInt(columns[10]),
                Gender: parseInt(columns[11]), // 0:남자, 1:여자
                Age: parseInt(columns[12]),
                month: columns[13],
                Publish_Month: parseInt(columns[14]),
                Page_cat: columns[15],
                Price_cat: columns[16]
            };
            parsedData.push(book);
        } else {
            console.log("Invalid line:", lines[i]);
        }
    }
    return parsedData;
}

function generateInsights() {

    var age = $('#age-select').val();
    var category = $('#cat-select').val();
    var gender = $('#sex-select').val();
    var genderCode = gender === '남성' ? 0 : (gender === '여성' ? 1 : undefined);

    if (age) {
        generateAgeInsights(age);
    }
    if (category) {
        generateCategoryInsights(category);
    }
    if (genderCode !== undefined) {
        generateGenderInsights(genderCode);
    }

    $('#myModal').show();
}

function generateAgeInsights(age) {
    var filteredData = bookData.filter(function(item) {
        return item.Age.toString() === age;
    });

    var preferences = calculateTopCategories(filteredData);
    var ageRatio = calculateAgeRatio(bookData, age);
    var genderRatio = calculateGenderRatio(filteredData);
    var pageLengthPreference = calculatePageLengthPreference(filteredData);
    var priceRangePreference = calculatePriceRangePreference(filteredData);

    $('#topCategoriesTitle').text(`${age}대가 선호하는 카테고리 TOP 5`);
    $('#ageRatioTitle').text(`전체 독자 중 ${age}대 비율`);
    $('#genderRatioTitle').text(`${age}대 독자 남녀 비율`);
    $('#pageLengthTitle').text(`${age}대 독자들이 선호하는 책 길이`);
    $('#priceRangeTitle').text(`${age}대 독자들이 선호하는 책의 가격`);

    destroyChart('topCategoriesChart');
    destroyChart('ageRatioChart');
    destroyChart('genderRatioChart');
    destroyChart('pageLengthChart');
    destroyChart('priceRangeChart');

    drawBarChart('topCategoriesChart', preferences);
    drawPieChart('ageRatioChart', ageRatio, `${age}대`);
    drawPieChart('genderRatioChart', genderRatio, `${age}대 독자 남녀 비율`);
    drawBarChart('pageLengthChart', pageLengthPreference);
    drawBarChart('priceRangeChart', priceRangePreference);
}

function generateCategoryInsights(category) {
    var filteredData = bookData.filter(function(item) {
        return item.Category === category;
    });

    var monthlyPublish = calculateMonthlyPublish(bookData, category);
    var agePreference = calculateAgePreference(filteredData);
    var genderPreference = calculateGenderPreference(filteredData);

    $('#categoryMonthlyPublishTitle').text(`${category} 월별 출판건수`);
    $('#categoryAgePreferenceTitle').text(`${category} 연령별 선호도`);
    $('#categoryGenderPreferenceTitle').text(`${category} 성별 선호도`);

    destroyChart('categoryMonthlyPublishChart');
    destroyChart('categoryAgePreferenceChart');
    destroyChart('categoryGenderPreferenceChart');

    drawBarChart('categoryMonthlyPublishChart', monthlyPublish);
    drawBarChart('categoryAgePreferenceChart', agePreference);
    drawBarChart('categoryGenderPreferenceChart', genderPreference);
}

function generateGenderInsights(genderCode) {
    var gender = genderCode === 0 ? '남성' : '여성';  // genderCode를 gender로 변환
    var filteredData = bookData.filter(function(item) {
        return item.Gender === genderCode;
    });

    var ageSalesIndex = calculateAgeSalesIndex(filteredData);
    var categoryPreference = calculateCategoryPreference(filteredData);
    var priceRangePreference = calculatePriceSexPreference(filteredData);
    var pageLengthPreference = calculatePageSexPreference(filteredData);

    $('#genderAgeSalesIndexTitle').text(`${gender === '남성' ? '남성' : '여성'} 연령별 판매지수`);
    $('#genderCategoryPreferenceTitle').text(`${gender === '남성' ? '남성' : '여성'} 카테고리별 선호도`);
    $('#genderPriceRangePreferenceTitle').text(`${gender === '남성' ? '남성' : '여성'} 가격대 선호도`);
    $('#genderPageLengthPreferenceTitle').text(`${gender === '남성' ? '남성' : '여성'} 페이지수 선호도`);

    destroyChart('genderAgeSalesIndexChart');
    destroyChart('genderCategoryPreferenceChart');
    destroyChart('genderPriceRangePreferenceChart');
    destroyChart('genderPageLengthPreferenceChart');

    drawBarChart('genderAgeSalesIndexChart', ageSalesIndex);
    drawBarChart('genderCategoryPreferenceChart', categoryPreference);
    drawBarChart('genderPriceRangePreferenceChart', priceRangePreference);
    drawBarChart('genderPageLengthPreferenceChart', pageLengthPreference);
}

// 시각화 관련 함수들
// 연령대 그래프
function calculateTopCategories(data) {
    var categorySales = {};
    data.forEach(function(item) {
        if (categorySales[item.Category]) {
            categorySales[item.Category] += item.Sales_Index;
        } else {
            categorySales[item.Category] = item.Sales_Index;
        }
    });

    var sortedCategories = Object.keys(categorySales).sort(function(a, b) {
        return categorySales[b] - categorySales[a];
    }).slice(0, 5);

    return sortedCategories.map(function(cat) {
        return {
            label: cat,
            value: categorySales[cat]
        };
    });
}

function calculateAgeRatio(data, age) {
    var totalBooks = data.length;
    var ageBooks = data.filter(function(item) {
        return item.Age.toString() === age;
    }).length;

    var ratio = (ageBooks / totalBooks) * 100;
    return {
        labels: ['나이대 비율', '나머지'],
        values: [ratio, 100 - ratio]
    };
}

function calculateGenderRatio(data) {
    var genderCounts = {0: 0, 1: 0};
    data.forEach(function(item) {
        genderCounts[item.Gender]++;
    });

    return {
        labels: ['여성', '남성'],
        values: [genderCounts[0], genderCounts[1]]
    };
}

function calculatePageLengthPreference(data) {
    var pageCategories = {};
    data.forEach(function(item) {
        if (pageCategories[item.Page_cat]) {
            pageCategories[item.Page_cat]++;
        } else {
            pageCategories[item.Page_cat] = 1;
        }
    });

    var sortedCategories = Object.keys(pageCategories).sort();
    return sortedCategories.map(function(cat) {
        return {
            label: cat,
            value: pageCategories[cat]
        };
    });
}

function calculatePriceRangePreference(data) {
    var priceCategories = {};
    data.forEach(function(item) {
        if (priceCategories[item.Price_cat]) {
            priceCategories[item.Price_cat]++;
        } else {
            priceCategories[item.Price_cat] = 1;
        }
    });

    var sortedCategories = Object.keys(priceCategories).sort();
    return sortedCategories.map(function(cat) {
        return {
            label: cat,
            value: priceCategories[cat]
        };
    });
}

function drawBarChart(canvasId, data) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(function(item) { return item.label; }),
            datasets: [{
                label: '판매 지수',
                data: data.map(function(item) { return item.value; }),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function drawPieChart(canvasId, data, title) {
    var ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                label: title,
                data: data.values,
                backgroundColor: ['lightblue', 'lightpink'],
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true
        }
    });
}

function destroyChart(canvasId) {
    var chartInstance = Chart.getChart(canvasId);
    if (chartInstance) {
        chartInstance.destroy();
    }
}

// 카테고리 그래프
function calculateMonthlyPublish(data, category) {
    var monthlyPublish = {};
    data.forEach(function(item) {
        if (item.Category === category) {
            var month = item.Publish_Month;
            if (monthlyPublish[month]) {
                monthlyPublish[month]++;
            } else {
                monthlyPublish[month] = 1;
            }
        }
    });

    var sortedMonths = Object.keys(monthlyPublish).sort(function(a, b) {
        return a - b;
    });

    return sortedMonths.map(function(month) {
        return {
            label: month + '월',
            value: monthlyPublish[month]
        };
    });
}

function calculateAgePreference(data) {
    var agePreference = {
        '10': 0,
        '20': 0,
        '30': 0,
        '40': 0,
        '50': 0,
        '60': 0
    };

    var totalBooks = data.length;

    data.forEach(function(item) {
        agePreference[item.Age.toString()]++;
    });

    var labels = Object.keys(agePreference);
    var values = labels.map(function(label) {
        return (agePreference[label] / totalBooks) * 100;
    });

    return labels.map(function(label, index) {
        return {
            label: label + '대',
            value: values[index]
        };
    });
}

function calculateGenderPreference(data) {
    var genderPreference = {
        '여성': 0,
        '남성': 0
    };

    var totalBooks = data.length;

    data.forEach(function(item) {
        genderPreference[item.Gender === 1 ? '여성' : '남성']++;
    });

    var labels = Object.keys(genderPreference);
    var values = labels.map(function(label) {
        return (genderPreference[label] / totalBooks) * 100;
    });

    return labels.map(function(label, index) {
        return {
            label: label,
            value: values[index]
        };
    });
}

 // 성별 그래프
 function calculateAgeSalesIndex(data, genderCode) {
    var ageSalesIndex = {};

    data.forEach(function(item) {
        var ageGroup = item.Age.toString();
        if (ageSalesIndex[ageGroup]) {
            ageSalesIndex[ageGroup] += item.Sales_Index;
        } else {
            ageSalesIndex[ageGroup] = item.Sales_Index;
        }
    });

    var sortedAgeSalesIndex = Object.keys(ageSalesIndex).sort(function(a, b) {
        return ageSalesIndex[b] - ageSalesIndex[a];
    }).slice(0, 5);

    return sortedAgeSalesIndex.map(function(ageGroup) {
        return {
            label: ageGroup + '대',
            value: ageSalesIndex[ageGroup]
        };
    });
}


 function calculateCategoryPreference(data, gender) {
     var categories = ['가정과 살림', '자연과학', '만화/라이트노벨', '역사', '건강 취미', '인문', '경제 경영', '자기계발', '유아', '소설/시/희곡'];
     var categoryPreference = categories.map(function(category) {
         var filteredData = data.filter(function(item) {
             return item.Category === category;
         });
         return filteredData.length;
     });

     return categories.map(function(category, index) {
         return {
             label: category,
             value: categoryPreference[index]
         };
     });
 }

 function calculatePriceSexPreference(data) {
    var priceCategories = ['0-10000', '10000-15000', '15000-17500', '17500-20000', '20000-25000', '25000+'];

    data.forEach(function(item) {
        item.Price_cat = item.Price_cat.trim();
    });

    var pricePreference = priceCategories.map(function(priceCategory) {
        var filteredData = data.filter(function(item) {
            return item.Price_cat === priceCategory;
        });

        return filteredData.length; // Count of items in the category
    });

    return priceCategories.map(function(priceCategory, index) {
        return {
            label: priceCategory,
            value: pricePreference[index]
        };
    });
}


 function calculatePageSexPreference(data) {
     var pageCategories = ['0-200', '200-250', '250-300', '300-350', '350-400', '400+'];
     var pagePreference = pageCategories.map(function(pageCategory) {
         var filteredData = data.filter(function(item) {
             return item.Page_cat === pageCategory;
         });
         return filteredData.length;
     });

     return pageCategories.map(function(pageCategory, index) {
         return {
             label: pageCategory,
             value: pagePreference[index]
         };
     });
 }
