from flask import Flask, render_template, request, redirect, url_for, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, DateField
from wtforms.validators import DataRequired
from datetime import datetime
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import generate_password_hash, check_password_hash
from form import TaskForm, LoginForm, RegistrationForm
from models import db, Task, User

# ----------------------------------------------------------------

app = Flask(__name__)
app.config['SECRET_KEY'] = 'd204225bde25be0ac91acab24e358b16e26f41a8282b411c'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
csrf = CSRFProtect(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    contents = db.Column(db.Text, nullable=False)
    input_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.Date, nullable=False)

class TaskForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    contents = TextAreaField('Contents', validators=[DataRequired()])
    due_date = DateField('Due Date', validators=[DataRequired()], format='%Y-%m-%d')

@app.before_request
def create_admin():
    with app.app_context():
        if not User.query.filter_by(username='admin').first():
            admin = User(username='admin', is_admin=True)
            admin.set_password('admin')
            db.session.add(admin)
            db.session.commit()


@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        # 사용자명 중복 확인
        existing_user = User.query.filter_by(username=form.username.data).first()
        if existing_user:
            flash(
                "Username already exists. Please choose a different username.", "danger"
            )
            return render_template("register.html", form=form)
        username = form.username.data
        password = form.password.data
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        flash("Registration successful. Please log in.", "success")
        return redirect(url_for("login"))
    return render_template("register.html", form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            session['user_id'] = user.id
            session['username'] = user.username
            session['is_admin'] = user.is_admin
            flash('Login successful', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password', 'danger')
    return render_template('login.html', form=form)


@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out', 'success')
    return redirect(url_for('login'))

#----------------------------------------------------------------

# 라우트 및 뷰 함수 정의
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def back_home():
    return render_template('index.html')

@app.route('/overview')
def overview():
    return render_template('overview.html')

@app.route('/publisher_service')
def publisher_service():
    return render_template('publisher_service.html')

@app.route('/customer_info')
def customer_info():
    return render_template('customer_info.html')

@app.route('/target_customer')
def target_customer():
    return render_template('target_customer.html')

@app.route('/reader_service')
def reader_service():
    return render_template('reader_service.html')

@app.route('/inquiry', methods=['GET', 'POST'])
def inquiry():
    form = TaskForm()  # GET 요청에서 폼 객체 생성
    
    if request.method == 'POST':
        if form.validate_on_submit():
            title = form.title.data
            contents = form.contents.data
            due_date = form.due_date.data

            new_task = Task(title=title, contents=contents, due_date=due_date)
            db.session.add(new_task)
            db.session.commit()

            return jsonify({'success': True}), 200
        else:
            errors = {field: form.errors[field][0] for field in form.errors}
            return jsonify({'success': False, 'errors': errors}), 400

    tasks = Task.query.all()
    return render_template('inquiry.html', form=form, tasks=tasks)

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    task_list = []
    for task in tasks:
        task_list.append({
            'id': task.id,
            'title': task.title,
            'contents': task.contents,
            'input_date': task.input_date.strftime('%Y-%m-%d %H:%M:%S'),
            'due_date': task.due_date.strftime('%Y-%m-%d')
        })
    return jsonify(task_list)

@app.route('/edit/<int:task_id>', methods=['GET', 'POST'])
def edit_task(task_id):
    task = Task.query.get_or_404(task_id)
    form = TaskForm(obj=task)
    if form.validate_on_submit():
        task.title = form.title.data
        task.contents = form.contents.data
        task.due_date = form.due_date.data
        db.session.commit()
        return redirect(url_for('inquiry'))
    return render_template('edit_task.html', form=form, task=task)

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return redirect(url_for('inquiry'))

@app.route('/admin')
def admin():
    if "user_id" not in session or not session['is_admin']:
        return redirect(url_for('login'))
    users = User.query.all()
    return render_template('admin.html', users=users)


if __name__ == '__main__':
    # @app.before_request에서 db를 만들어주면서 필요 없어짐.
    # with app.app_context():
    #     db.create_all()
    app.run(debug=True)