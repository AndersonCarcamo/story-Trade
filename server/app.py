from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from models2 import app, db, User, Book, BookInfo, Genre, Like, Notification, Match, PaymentOption, Transaction
from sqlalchemy import func


CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/search', methods=['GET'])
def search_books():
    query = request.args.get('query')
    if not query:
        abort(400, description="Query parameter is required")

    try:
        # Crear el vector de búsqueda utilizando to_tsquery con unaccent
        search_vector = func.to_tsquery('spanish', func.replace(func.unaccent(query), ' ', '&') + ':*')
        results = (
            db.session.query(BookInfo)
            .join(Book, Book.book_info_id == BookInfo.id)
            .filter(BookInfo.tsvector.op('@@')(search_vector))
            .all()
        )
        return jsonify([book_info.as_dict() for book_info in results])
    except Exception as e:
        print(f"Error during search: {e}")
        abort(500, description="Internal Server Error")

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.as_dict() for user in users])

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        abort(404)
    return jsonify(user.as_dict())

@app.route('/users', methods=['POST'])
def create_user():
    if not request.json or not 'email' in request.json or not 'name' in request.json or not 'username' in request.json or not 'password' in request.json:
        abort(400)
    new_user = User(
        name=request.json.get('name', ''),
        username=request.json.get('username', ''),
        email=request.json.get('email', ''),
        password=request.json.get('password', ''),
        phone=request.json.get('phone', ''),
        age=request.json.get('age', 0),
        avatar=request.json.get('avatar', 'default.png')
    )
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500)
    return jsonify(new_user.as_dict()), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        abort(404)
    if not request.json:
        abort(400)
    user.name = request.json.get('name', user.name)
    user.username = request.json.get('username', user.username)
    user.email = request.json.get('email', user.email)
    user.phone = request.json.get('phone', user.phone)
    user.age = request.json.get('age', user.age)
    user.avatar = request.json.get('avatar', user.avatar)
    user.rating = request.json.get('rating', user.rating)
    user.rating_count = request.json.get('rating_count', user.rating_count)
    user.exchanges = request.json.get('exchanges', user.exchanges)
    db.session.commit()
    return jsonify(user.as_dict())

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        abort(404)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"result": True})

@app.route('/users/<int:user_id>/genres', methods=['POST'])
def add_genre(user_id):
    user = User.query.get(user_id)
    if user is None:
        abort(404)
    if not request.json or not 'genre' in request.json:
        abort(400)
    genre_name = request.json['genre']
    genre = Genre.query.filter_by(name=genre_name).first()
    if genre is None:
        genre = Genre(name=genre_name)
        db.session.add(genre)
    user.genres.append(genre)
    db.session.commit()
    return jsonify(user.as_dict())

@app.route('/users/<int:user_id>/books', methods=['POST'])
def add_book(user_id):
    user = User.query.get(user_id)
    if user is None:
        abort(404)
    if not request.json or not 'title' in request.json or not 'author' in request.json:
        abort(400)
    
    # Buscar si el libro ya existe en la tabla BookInfo
    book_info = BookInfo.query.filter_by(
        title=request.json['title'],
        author=request.json['author']
    ).first()

    if not book_info:
        # Crear un nuevo registro en BookInfo si no existe
        book_info = BookInfo(
            title=request.json['title'],
            author=request.json['author'],
            description=request.json.get('description', ''),
            image=request.json.get('image', ''),
            category=request.json.get('category', ''),
            rating=request.json.get('rating', 0.0),
            release_year=request.json.get('release_year', ''),
            tsvector=db.func.to_tsvector(
                request.json['title'] + ' ' + request.json['author'] + ' ' + request.json.get('category', '')
            )
        )
        db.session.add(book_info)
        db.session.commit()

    # Agregar la información del libro al usuario
    book = Book(
        book_info_id=book_info.id,
        user_id=user.id,
        antiquity=request.json.get('antiquity', ''),
        editorial=request.json.get('editorial', ''),
        video=request.json.get('video', '')
    )
    db.session.add(book)
    db.session.commit()
    return jsonify(user.as_dict())

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([book.as_dict() for book in books])

@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get(book_id)
    if book is None:
        abort(404)
    return jsonify(book.as_dict())

@app.route('/books', methods=['POST'])
def create_book():
    if not request.json or not 'title' in request.json:
        abort(400)
    # Similar lógica para verificar existencia en BookInfo
    book_info = BookInfo.query.filter_by(
        title=request.json['title'],
        author=request.json['author']
    ).first()

    if not book_info:
        book_info = BookInfo(
            title=request.json.get('title', ''),
            author=request.json.get('author', ''),
            description=request.json.get('description', ''),
            image=request.json.get('image', ''),
            category=request.json.get('category', ''),
            rating=request.json.get('rating', 0.0),
            release_year=request.json.get('release_year', ''),
            tsvector=db.func.to_tsvector(
                request.json['title'] + ' ' + request.json['author'] + ' ' + request.json.get('category', '')
            )
        )
        db.session.add(book_info)
        db.session.commit()

    new_book = Book(
        book_info_id=book_info.id,
        user_id=request.json.get('user_id', ''),
        antiquity=request.json.get('antiquity', ''),
        editorial=request.json.get('editorial', ''),
        video=request.json.get('video', '')
    )
    try:
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500)
    return jsonify(new_book.as_dict()), 201

@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = Book.query.get(book_id)
    if book is None:
        abort(404)
    if not request.json:
        abort(400)
    book.antiquity = request.json.get('antiquity', book.antiquity)
    book.editorial = request.json.get('editorial', book.editorial)
    book.video = request.json.get('video', book.video)
    db.session.commit()
    return jsonify(book.as_dict())

@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get(book_id)
    if book is None:
        abort(404)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"result": True})

@app.route('/login', methods=['POST'])
def login():
    if not request.json or not 'email' in request.json or not 'password' in request.json:
        abort(400)
    email = request.json['email']
    password = request.json['password']
    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        abort(401)
    return jsonify({"id": user.id, "email": user.email, "name": user.name})

@app.route('/like/<int:book_id>', methods=['POST'])
def like_book(book_id):
    try:
        if not request.json or not 'user_id' in request.json or not 'liker_id' in request.json:
            abort(400, description="user_id and liker_id are required")

        user_id = request.json['user_id']
        liker_id = request.json['liker_id']

        existing_like = Like.query.filter_by(user_id=user_id, book_id=book_id, liker_id=liker_id).first()
        if existing_like:
            abort(400, description="You have already liked this book")

        like = Like(
            user_id=user_id,
            book_id=book_id,
            liker_id=liker_id
        )

        like = Like(user_id=user_id, book_id=book_id, liker_id=liker_id)
        try:
            db.session.add(like)
            db.session.commit()
            create_notification(like.user_id, f"Your book has been liked by user {like.liker_id}")

        except Exception as e:
            db.session.rollback()
            print(e)
            abort(500, description="Internal Server Error")

        return jsonify(like.as_dict()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error: {e}")
        abort(500, description="Internal Server Error")

@app.route('/unlike/<int:book_id>', methods=['POST'])
def unlike_book(book_id):
    if not request.json or not 'user_id' in request.json or not 'liker_id' in request.json:
        abort(400, description="user_id and liker_id are required")

    user_id = request.json['user_id']
    liker_id = request.json['liker_id']

    # Verificar si el like existe
    existing_like = Like.query.filter_by(user_id=user_id, book_id=book_id, liker_id=liker_id).first()
    if not existing_like:
        abort(400, description="You have not liked this book yet")

    try:
        db.session.delete(existing_like)
        db.session.commit()
        create_notification(existing_like.user_id, f"Your book has been unliked by user {existing_like.liker_id}")
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500, description="Internal Server Error")

    return jsonify({"message": "Like removed"}), 200

@app.route('/like/<int:book_id>/check', methods=['POST'])
def check_like(book_id):
    if not request.json or not 'user_id' in request.json or not 'liker_id' in request.json:
        abort(400, description="user_id and liker_id are required")

    user_id = request.json['user_id']
    liker_id = request.json['liker_id']

    # Verificar si el like ya existe
    existing_like = Like.query.filter_by(user_id=user_id, book_id=book_id, liker_id=liker_id).first()
    return jsonify({"hasLiked": existing_like is not None})


@app.route('/notifications/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    notifications = Notification.query.filter_by(user_id=user_id).all()
    return jsonify([notification.as_dict() for notification in notifications])

@app.route('/notifications/<int:notification_id>', methods=['PUT'])
def mark_notification_as_read(notification_id):
    notification = Notification.query.get(notification_id)
    if notification is None:
        abort(404)
    notification.is_read = True
    db.session.commit()
    return jsonify(notification.as_dict())

@app.route('/matches', methods=['POST'])
def create_match():
    if not request.json or not 'user1_id' in request.json or not 'user2_id' in request.json:
        abort(400)
    match = Match(
        user1_id=request.json['user1_id'],
        user2_id=request.json['user2_id']
    )
    try:
        db.session.add(match)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500)
    return jsonify(match.as_dict()), 201

@app.route('/matches/<int:user_id>', methods=['GET'])
def get_matches(user_id):
    matches = Match.query.filter((Match.user1_id == user_id) | (Match.user2_id == user_id)).all()
    return jsonify([match.as_dict() for match in matches])

@app.route('/payment-options', methods=['GET'])
def get_payment_options():
    payment_options = PaymentOption.query.all()
    return jsonify([option.as_dict() for option in payment_options])

@app.route('/transactions', methods=['POST'])
def create_transaction():
    if not request.json or not 'user_id' in request.json or not 'book_id' in request.json:
        abort(400)
    transaction = Transaction(
        user_id=request.json['user_id'],
        book_id=request.json['book_id'],
        rating=request.json.get('rating', 0.0)
    )
    try:
        db.session.add(transaction)
        db.session.commit()
        # Actualizar el rating del usuario
        user = User.query.get(transaction.user_id)
        if user:
            user.transaction_rating = (user.transaction_rating * user.exchanges + transaction.rating) / (user.exchanges + 1)
            user.exchanges += 1
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(e)
        abort(500)
    return jsonify(transaction.as_dict()), 201

@app.route('/users/<int:user_id>/rating', methods=['POST'])
def update_user_rating(user_id):
    user = User.query.get(user_id)
    if user is None:
        abort(404)
    if not request.json or not 'rating' in request.json:
        abort(400)
    rating = request.json['rating']
    user.rating = (user.rating * user.rating_count + rating) / (user.rating_count + 1)
    user.rating_count += 1
    db.session.commit()
    return jsonify(user.as_dict())

@app.route('/transactions/<int:transaction_id>/rate', methods=['POST'])
def rate_transaction(transaction_id):
    data = request.get_json()
    user_rating = data.get('user_rating')
    transaction_rating = data.get('transaction_rating')
    
    # Actualizar la calificación de la transacción
    transaction = Transaction.query.get(transaction_id)
    if transaction is None:
        abort(404, description="Transaction not found")
    transaction.rating = transaction_rating
    db.session.commit()

    # Actualizar la calificación del usuario
    user = User.query.get(transaction.user_id)
    if user is None:
        abort(404, description="User not found")
    new_rating = (user.rating * user.rating_count + user_rating) / (user.rating_count + 1)
    user.rating = new_rating
    user.rating_count += 1
    db.session.commit()

    return jsonify({"message": "Rating updated successfully"})

def create_notification(user_id, message):
    notification = Notification(
        user_id=user_id,
        message=message
    )
    db.session.add(notification)
    db.session.commit()

if __name__ == '__main__':
    app.run(debug=True)
