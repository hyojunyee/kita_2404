from flask import Flask, render_template, redirect, url_for, request, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField#, PasswordField, BooleanField
from wtforms.validators import DataRequired#, Length, Email, EqualTo, ValidationError

# DB를 만드는 과정
app = Flask(__name__)
# app.config.from_pyfile('config.py')
app.config['SECRET_KEY'] = '05989cf666c35c86ed97ce90add7ca1882046237c6529a1f'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///example.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db를 app과 연동
db = SQLAlchemy(app)

# 여기서 Task는 table이름 Oracle 생각해보면 됨.
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)

class TaskForm(FlaskForm):
    # index.html에서 쓴 것을 똑같이 쓴다
    title = StringField('Title', validators=[DataRequired()])
    submit = SubmitField('Add Task')

@app.route('/', methods=['GET', 'POST'])
def index():
    form = TaskForm()
    if form.validate_on_submit():
        new_task = Task(title=form.title.data)
        db.session.add(new_task)
        db.session.commit()
        return redirect(url_for('index')) # order_by(Task.id.desc()). 넣어서 id순 정렬 가능
    return render_template('index.html', form=form)

@app.route('/tasks')
def tasks():
    tasks = Task.query.all()
    return jsonify([{'id' : task.id, 'title' : task.title} for task in tasks])

@app.route('/edit/<int:task_id>', methods=['GET', 'POST'])
def edit(task_id):
    task = Task.query.get_or_404(task_id) # get_or_404는 task_id가 없으면 404에러를 발생
    form = TaskForm()
    if form.validate_on_submit():
        task.title = form.title.data
        db.session.commit()
        # 여기서 redirect는 index 함수가 실행됨
        return redirect(url_for('index'))
    form.title.data = task.title
    return render_template('edit_task.html', form=form, task_id=task_id, task_title=task.title)

@app.route('/delete/<int:task_id>')
def delete(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
    