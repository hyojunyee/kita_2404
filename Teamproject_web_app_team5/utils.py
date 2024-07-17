import pandas as pd

# 데이터프레임 로드
df = pd.read_csv('D:\kdt_240424\workspace\m4_웹애플리케이션구축\Teamproject_web_app_team5\static\data\yes24_bestseller_data_final.csv')

def get_book_recommendations(gender, age):
    # 성별로 1위 카테고리 찾기
    if gender == 'male':
        gender_cat = df.loc[df['Gender'] == 0].groupby('Category')['Sales_Index'].mean().idxmax()
    elif gender == 'female':
        gender_cat = df.loc[df['Gender'] == 1].groupby('Category')['Sales_Index'].mean().idxmax()
    else:
        gender_cat = None
    
    # 나이로 1위 카테고리 찾기 
    age_cat = df.loc[df['Age'] == age // 10 * 10].groupby('Category')['Sales_Index'].mean().idxmax()
    
    # 두 카테고리의 합집합 찾기
    top_categories = set([gender_cat]).union(set([age_cat]))
    
    # 합집합 카테고리 중 가장 높은 Sales_Index 도서 추천
    if top_categories:
        recommendations = []
        for cat in top_categories:
            top_book = df.loc[(df['Category'] == cat)].sort_values('Sales_Index', ascending=False).iloc[0]
            recommendations.append(f"제목: {top_book['Title']} 작가: {top_book['Author']} 카테고리: {cat}")
        return '\n'.join(recommendations)
    else:
        return None