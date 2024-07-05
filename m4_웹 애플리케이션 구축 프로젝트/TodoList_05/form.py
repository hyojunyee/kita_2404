from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, TextAreaField, DateField #, PasswordField, BooleanField
from wtforms.validators import DataRequired#, Length, Email, EqualTo, ValidationError

class TaskForm(FlaskForm):
    title = StringField('제목', validators=[DataRequired()])
    contents = TextAreaField('내용', validators=[DataRequired()])
    due_date = DateField('마감일', format='%Y-%m-%d', validators=[DataRequired()])