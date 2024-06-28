# models.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://{USUARIO}:{CONTRASENIA}@localhost/{NOMBRE_DE_LA_BD}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Asociación muchos a muchos para usuarios y géneros
user_genres = db.Table('user_genres',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id'), primary_key=True)
)

# Asociación muchos a muchos para usuarios y libros
user_books = db.Table('user_books',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('book_id', db.Integer, db.ForeignKey('books.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    phone = db.Column(db.String(15), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    avatar = db.Column(db.String(100), nullable=True)
    rating = db.Column(db.Float, nullable=True, default=0.0)
    exchanges = db.Column(db.Integer, nullable=True, default=0)
    genres = db.relationship('Genre', secondary=user_genres, lazy='subquery',
                             backref=db.backref('users', lazy=True))
    books = db.relationship('Book', secondary=user_books, lazy='subquery',
                            backref=db.backref('users', lazy=True))

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "phone": self.phone,
            "age": self.age,
            "avatar": self.avatar,
            "rating": self.rating,
            "exchanges": self.exchanges,
            "genres": [genre.name for genre in self.genres],
            "books": [book.as_dict() for book in self.books]
        }


class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(100), nullable=True)
    category = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, nullable=True)
    video = db.Column(db.String(100), nullable=True)
    editorial = db.Column(db.String(100), nullable=True)
    antiquity = db.Column(db.String(50), nullable=True)

    def as_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "image": self.image,
            "category": self.category,
            "description": self.description,
            "rating": self.rating,
            "video": self.video,
            "editorial": self.editorial,
            "antiquity": self.antiquity
        }


class Genre(db.Model):
    __tablename__ = 'genres'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name
        }

class Like(db.Model):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    liker_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class Match(db.Model):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

class PaymentOption(db.Model):
    __tablename__ = 'payment_options'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
