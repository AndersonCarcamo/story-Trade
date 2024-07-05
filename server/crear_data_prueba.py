from models2 import app, db, User, Book, BookInfo, Genre
from sqlalchemy import text

with app.app_context():
    # Crear la extensión unaccent si no existe
    with db.engine.connect() as connection:
        connection.execute(text('CREATE EXTENSION IF NOT EXISTS unaccent;'))
    
    # Limpiar las tablas existentes
    db.session.query(Book).delete()
    db.session.query(BookInfo).delete()
    db.session.query(User).delete()
    db.session.query(Genre).delete()
    db.session.commit()

    # Crear géneros
    genres = ['Romance', 'Terror', 'Fantasía', 'Ciencia Ficción', 'Misterio', 'Aventura', 'Histórico']
    for genre_name in genres:
        genre = Genre(name=genre_name)
        db.session.add(genre)

    # Crear usuarios
    users = [
        {"name": "Carlos Pérez", "username": "carlosp", "email": "carlos@example.com", "password": "password1", "phone": "123456789", "age": 30, "avatar": "avatar1.png", "rating": 4.5, "exchanges": 5},
        {"name": "María Gómez", "username": "mariag", "email": "maria@example.com", "password": "password2", "phone": "987654321", "age": 25, "avatar": "avatar2.png", "rating": 4.0, "exchanges": 3},
        {"name": "José Sáenz", "username": "joses", "email": "jose@example.com", "password": "password3", "phone": "555555555", "age": 28, "avatar": "avatar3.png", "rating": 3.5, "exchanges": 7},
        {"name": "Ana López", "username": "anal", "email": "ana@example.com", "password": "password4", "phone": "666666666", "age": 35, "avatar": "avatar4.png", "rating": 5.0, "exchanges": 10},
        {"name": "Luna Díaz", "username": "lunad", "email": "luna@example.com", "password": "password5", "phone": "777777777", "age": 22, "avatar": "avatar5.png", "rating": 3.0, "exchanges": 1},
        {"name": "Fabricio Campos", "username": "fabricioc", "email": "fabricio@example.com", "password": "password6", "phone": "888888888", "age": 27, "avatar": "avatar6.png", "rating": 4.2, "exchanges": 6},
        {"name": "Carmen Pérez", "username": "carmenp", "email": "carmen@example.com", "password": "password7", "phone": "999999999", "age": 29, "avatar": "avatar7.png", "rating": 3.8, "exchanges": 4},
    ]
    for user_data in users:
        user = User(**user_data)
        db.session.add(user)
    
    db.session.commit()

    # Crear libros (BookInfo)
    books_info = [
        {"title": "Bajo La Misma Estrella", "author": "John Green", "description": "Una historia de amor entre dos jóvenes con cáncer.", "image": "book1.jpg", "category": "Romance", "rating": 4.1, "release_year": "2012"},
        {"title": "It", "author": "Stephen King", "description": "Un grupo de niños se enfrenta a un monstruo que cambia de forma.", "image": "book2.jpg", "category": "Terror", "rating": 4.7, "release_year": "1986"},
        {"title": "La Sombra del Viento", "author": "Carlos Ruiz Zafón", "description": "Un joven descubre un libro misterioso en la Barcelona de posguerra.", "image": "book3.jpg", "category": "Misterio", "rating": 4.5, "release_year": "2001"},
        {"title": "Cien Años de Soledad", "author": "Gabriel García Márquez", "description": "La historia de la familia Buendía a lo largo de siete generaciones.", "image": "book4.jpg", "category": "Histórico", "rating": 4.9, "release_year": "1967"},
        {"title": "Harry Potter y la Piedra Filosofal", "author": "J.K. Rowling", "description": "El inicio de las aventuras de Harry Potter en el mundo mágico.", "image": "book5.jpg", "category": "Fantasía", "rating": 4.8, "release_year": "1997"},
        {"title": "1984", "author": "George Orwell", "description": "Una distopía sobre un régimen totalitario que controla todos los aspectos de la vida.", "image": "book6.jpg", "category": "Ciencia Ficción", "rating": 4.6, "release_year": "1949"},
        {"title": "El Hobbit", "author": "J.R.R. Tolkien", "description": "La aventura de Bilbo Bolsón en su viaje para ayudar a un grupo de enanos.", "image": "book7.jpg", "category": "Fantasía", "rating": 4.7, "release_year": "1937"},
        {"title": "La Casa de los Espíritus", "author": "Isabel Allende", "description": "La saga de la familia Trueba a lo largo de varias generaciones.", "image": "book8.jpg", "category": "Histórico", "rating": 4.4, "release_year": "1982"},
        {"title": "Los Juegos del Hambre", "author": "Suzanne Collins", "description": "Un futuro distópico donde los adolescentes deben luchar a muerte en un espectáculo televisado.", "image": "book9.jpg", "category": "Ciencia Ficción", "rating": 4.3, "release_year": "2008"},
        {"title": "El Código Da Vinci", "author": "Dan Brown", "description": "Un profesor de simbología desentraña un misterio religioso en París.", "image": "book10.jpg", "category": "Misterio", "rating": 4.2, "release_year": "2003"},
        {"title": "La Catedral del Mar", "author": "Ildefonso Falcones", "description": "La construcción de una iglesia en la Barcelona medieval.", "image": "book11.jpg", "category": "Histórico", "rating": 4.1, "release_year": "2006"},
        {"title": "El Nombre del Viento", "author": "Patrick Rothfuss", "description": "La historia de un héroe y su viaje para descubrir la verdad sobre su pasado.", "image": "book12.jpg", "category": "Fantasía", "rating": 4.8, "release_year": "2007"},
        {"title": "Don Quijote de la Mancha", "author": "Miguel de Cervantes", "description": "Las aventuras de un hidalgo que pierde la cordura y se convierte en caballero andante.", "image": "book13.jpg", "category": "Aventura", "rating": 4.5, "release_year": "1605"},
        {"title": "El Señor de los Anillos", "author": "J.R.R. Tolkien", "description": "La épica aventura de un grupo de héroes para destruir un anillo mágico.", "image": "book14.jpg", "category": "Fantasía", "rating": 4.9, "release_year": "1954"},
        {"title": "El Retrato de Dorian Gray", "author": "Oscar Wilde", "description": "La historia de un joven que mantiene su belleza mientras su retrato envejece.", "image": "book15.jpg", "category": "Terror", "rating": 4.4, "release_year": "1890"},
        {"title": "Crónica de una Muerte Anunciada", "author": "Gabriel García Márquez", "description": "La crónica de un asesinato anunciado en un pequeño pueblo.", "image": "book16.jpg", "category": "Misterio", "rating": 4.3, "release_year": "1981"},
        {"title": "La Metamorfosis", "author": "Franz Kafka", "description": "Un hombre se despierta convertido en un insecto gigante.", "image": "book17.jpg", "category": "Ciencia Ficción", "rating": 4.2, "release_year": "1915"},
        {"title": "El Alquimista", "author": "Paulo Coelho", "description": "La historia de un pastor que viaja en busca de su leyenda personal.", "image": "book18.jpg", "category": "Aventura", "rating": 4.1, "release_year": "1988"},
        {"title": "La Chica del Tren", "author": "Paula Hawkins", "description": "Una mujer observa a una pareja desde el tren y descubre un misterio.", "image": "book19.jpg", "category": "Misterio", "rating": 4.0, "release_year": "2015"},
        {"title": "Percy Jackson y el Ladrón del Rayo", "author": "Rick Riordan", "description": "Un joven descubre que es el hijo de un dios griego y debe salvar el Olimpo.", "image": "book20.jpg", "category": "Fantasía", "rating": 4.5, "release_year": "2005"},
    ]
    for book_info_data in books_info:
        book_info = BookInfo(**book_info_data)
        db.session.add(book_info)

    db.session.commit()

    all_books_info = BookInfo.query.all()
    print(f"Total BookInfo entries: {len(all_books_info)}")
    for book_info in all_books_info:
        print(f"BookInfo ID: {book_info.id}, Title: {book_info.title}")

    # Asignar algunos libros a los usuarios para el intercambio
    user1 = User.query.filter_by(username="carlosp").first()
    user2 = User.query.filter_by(username="mariag").first()

    book1 = Book(book_info_id=13, user_id=user1.id, antiquity="2020", editorial="Editorial A", video="")
    book2 = Book(book_info_id=14, user_id=user1.id, antiquity="2021", editorial="Editorial B", video="")
    book3 = Book(book_info_id=5, user_id=user1.id, antiquity="2018", editorial="Editorial C", video="")
    book4 = Book(book_info_id=12, user_id=user2.id, antiquity="2019", editorial="Editorial D", video="")

    db.session.add(book1)
    db.session.add(book2)
    db.session.add(book3)
    db.session.add(book4)

    # Asignar géneros a los usuarios
    user1.genres.append(Genre.query.filter_by(name='Fantasía').first())
    user1.genres.append(Genre.query.filter_by(name='Aventura').first())
    user2.genres.append(Genre.query.filter_by(name='Romance').first())
    user2.genres.append(Genre.query.filter_by(name='Ciencia Ficción').first())

    db.session.commit()
