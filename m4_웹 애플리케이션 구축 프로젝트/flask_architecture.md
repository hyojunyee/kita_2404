- 사용자 (User): 웹 브라우저를 통해 웹 서버에 HTML 요청을 보내고 HTML 응답을 받음.
- 웹 서버 (Web Server): 사용자의 요청을 받아 처리하고 응답을 반환하는 중심 역할을 함.
- 정적 파일 저장소 (Static Files Storage): CSS와 JavaScript 같은 정적 파일들을 저장함.
- Python 웹 애플리케이션: 웹 서버와 WSGI(Web Server Gateway Interface)를 통해 연결되어 동적 콘텐츠를 생성
- WSGI: 웹 서버와 Python 웹 애플리케이션 사이의 표준 인터페이스임.

작동 흐름:
1. 사용자가 브라우저를 통해 HTML 요청을 보냄.
- 정적인 파일일 경우 정적 파일 저장소에서 데이터를 받아옴 
- 동적인 파일일 경우 웹 에플리케이션 서버로 가서 DB(Oracle, MySQL...)등에서 데이터를 받아옴
- 웹 에플리케이션 <-WSGI-> 웹 에플리케이션 서버
- templates가 필요함.(ex> index, JavaScript...)
2. 웹 서버가 요청을 받아 처리함.
3. 정적 파일이 필요한 경우, 웹 서버는 정적 파일 저장소에서 파일을 가져옴.
4. 동적 콘텐츠가 필요한 경우, 웹 서버는 WSGI를 통해 Python 웹 애플리케이션에 요청을 전달
5. Python 웹 애플리케이션이 요청을 처리하고 응답을 생성
6. 웹 서버가 최종 HTML 응답을 사용자에게 반환

- 집중해야될 것 HTML Response, Web Application and CSS, JS
- AWS, Docker 알아보기