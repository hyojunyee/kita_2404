from flask import Flask, render_template, redirect, url_for, request, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, DateField #, PasswordField, BooleanField
from wtforms.validators import DataRequired#, Length, Email, EqualTo, ValidationError
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from datetime import datetime
import pytz

# DB를 만드는 과정
app = Flask(__name__)
app.config.from_pyfile('config.py')

# db를 app과 연동
db = SQLAlchemy(app)
migrate = Migrate(app, db)
csrf = CSRFProtect(app)

# 여기서 Task는 table, Oracle 생각해보면 됨
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False) # string 100글자 제한
    contents = db.Column(db.Text, nullable=False)     # Text는 제한이 없음(4000자?)
    input_date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    due_date = db.Column(db.Date, nullable=True)
    

class TaskForm(FlaskForm):
    # index.html에서 쓴 것과 양식에 맞춰씀
    title = StringField('제목', validators=[DataRequired()])
    contents = TextAreaField('내용', validators=[DataRequired()])
    due_date = DateField('마감일', format='%Y-%m-%d', validators=[DataRequired()])

@app.route('/')
def index():
    form = TaskForm()
    csrf_token = form.csrf_token._value()
    return render_template('index.html', form=form, csrf_token=csrf_token)

@app.route('/tasks')
def tasks():
    tasks = Task.query.all()
    return jsonify(
        [
            {'id' : task.id,
             'title' : task.title,
             'contents' : task.contents,
             'input_date' : task.input_date.strftime("%Y-%m-%d"),
             'due_date' : task.due_date.strftime("%Y-%m-%d"),
            }
            for task in tasks
        ]
    )

@app.route('/', methods=['POST'])
def add_task():
    form = TaskForm()
    if form.validate_on_submit():
        title = form.title.data
        contents = form.contents.data
        
        # 한국시간으로 현재 날짜 생성
        kst = pytz.timezone('Asia/Seoul')
        input_date = datetime.now(kst).date()
        
        due_date = form.due_date.data
        
        new_task = Task(
            title=title,
            contents=contents,
            input_date=input_date,
            due_date=due_date
        )
        
        db.session.add(new_task)
        db.session.commit()
        return redirect(url_for('index'))
    csrf_token = form.csrf_token._value()        
    return render_template('index.html', form=form)

@app.route('/edit/<int:task_id>', methods=['GET', 'POST'])
def edit(task_id):
    task = Task.query.get_or_404(task_id)
    # task 객체를 초기화 함
    form = TaskForm(obj=task)
    if request.method == 'POST' and form.validate_on_submit():
        task.title = form.title.data
        task.contents = form.contents.data
        task.due_date = form.due_date.data
        db.session.commit()
        return redirect(url_for('index'))
    
    csrf_token = form.csrf_token._value()
    return render_template(
        'edit_task.html',
        form=form,
        csrf_token=csrf_token,
        task_id=task.id,
        task_title=task.title,
        task_contents=task.contents,
        task_input_date=task.input_date.strftime("%Y-%m-%d"),
        task_due_date=task.due_date.strftime("%Y-%m-%d"),
    )

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)