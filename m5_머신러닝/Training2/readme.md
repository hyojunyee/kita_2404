## python 가상환경 설정

python 버전확인:
python --version

python 위치확인:
where python

가상환경 생성 :
cd my_project
python -m venv myenv

C:\Users\Administrator\AppData\Local\Programs\Python\Python310\python.exe

가상환경 활성화:
myenv\Scripts\activate

패키지 설치 및 관리:
pip install requests

가상환경 비활성화:
deactivate

가상환경에 설치된 모든 패키지 목록을 requirements.txt 파일로 저장
pip freeze > requirements.txt

requirements.txt 파일을 사용하여 패키지 설치
pip install -r requirements.txt

Python의 패키지 관리자인 pip를 최신 버전으로 업그레이드하는 명령어
python.exe -m pip install --upgrade pip

## db 변경
db 초기화 및 migration시 기존 버전 삭제
flask db init
flask db migrate -m "migration"
flask db upgrade

DELETE FROM alembic_version WHERE version_num = '82999e1295e2';

user = db.session.get(User, user_id) or abort(404)

scikit-surprise를 설치 전 Microsoft Visual C++ Build Tools 설치

Microsoft Visual C++ Build Tools 설치
Microsoft Visual C++ Build Tools 웹사이트를 방문합니다.
"Download Build Tools"를 클릭하여 다운로드합니다.
다운로드한 설치 프로그램을 실행합니다.
설치 화면에서 "Desktop development with C++" 워크로드를 선택하고 설치를 진행합니다.

scikit-surprise 패키지 설치
