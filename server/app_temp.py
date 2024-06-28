from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Index, event, func, text
from sqlalchemy.dialects.postgresql import TSVECTOR
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Anvarnv23@localhost/story_trade_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, resources={r"/*": {"origins": "*"}})

db = SQLAlchemy(app)

# Asociación muchos a muchos para usuarios y géneros
user_genres = db.Table('user_genres',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('genre_id', db.Integer, db.ForeignKey('genres.id'), primary key=True)
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

class BookInfo(db.Model):
    __tablename__ = 'book_info'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False, unique=True)
    author = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(100), nullable=True)
    category = db.Column(db.String(50), nullable=False)
    rating = db.Column(db.Float, nullable=True)
    release_year = db.Column(db.String(4), nullable=False)  # Año de lanzamiento
    tsvector = db.Column(TSVECTOR)
    __table_args__ = (Index('tsvector_idx', 'tsvector', postgresql_using='gin'),)

    def as_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "description": self.description,
            "image": self.image,
            "category": self.category,
            "rating": self.rating,
            "release_year": self.release_year
        }

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    book_info_id = db.Column(db.Integer, db.ForeignKey('book_info.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    antiquity = db.Column(db.String(50), nullable=False)
    editorial = db.Column(db.String(100), nullable=False)
    video = db.Column(db.String(100), nullable=True)
    book_info = db.relationship('BookInfo', backref=db.backref('book_instances', lazy=True))

    def as_dict(self):
        return {
            "id": self.id,
            "book_info_id": self.book_info_id,
            "user_id": self.user_id,
            "antiquity": self.antiquity,
            "editorial": self.editorial,
            "video": self.video,
            "book_info": self.book_info.as_dict()
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

    def as_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "book_id": self.book_id,
            "liker_id": self.liker_id,
            "timestamp": self.timestamp
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(200), nullable=False)
    is_read = db.Column(db.Boolean, nullable=False, default=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def as_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "message": self.message,
            "is_read": self.is_read,
            "timestamp": self.timestamp
        }

class Match(db.Model):
    __tablename__ = 'matches'
    id = db.Column(db.Integer, primary_key=True)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    def as_dict(self):
        return {
            "id": self.id,
            "user1_id": self.user1_id,
            "user2_id": self.user2_id,
            "timestamp": self.timestamp
        }

class PaymentOption(db.Model):
    __tablename__ = 'payment_options'
    id = db.Column(db.Integer, primary key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)

    def as_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price
        }

@event.listens_for(BookInfo, 'before_insert')
def update_tsvector(mapper, connection, target):
    target.tsvector = func.to_tsvector(
        'spanish',
        func.unaccent(' '.join([
            target.title,
            target.author,
            target.category
        ]))
    )

@event.listens_for(BookInfo, 'before_update')
def update_tsvector(mapper, connection, target):
    target.tsvector = func.to_tsvector(
        'spanish',
        func.unaccent(' '.join([
            target.title,
            target.author,
            target.category
        ]))
    )

if __name__ == '__main__':
    with app.app_context():
        # Crear la extensión unaccent si no existe
        with db.engine.connect() as connection:
            connection.execute(text('CREATE EXTENSION IF NOT EXISTS unaccent;'))
        db.create_all()
        # Agregar aquí la creación de datos de ejemplo si es necesario
