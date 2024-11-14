from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)

# SQLite Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ecommerce.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    count = db.Column(db.Integer, default=0)

# Create tables
with app.app_context():
    db.create_all()
    
    # Add initial data if tables are empty
    if not Category.query.first():
        categories = [
            Category(name="New Arrivals", count=127),
            Category(name="Summer Collection", count=89),
            Category(name="Winter Essentials", count=93),
            Category(name="Accessories", count=154)
        ]
        db.session.add_all(categories)
        
    if not Product.query.first():
        products = [
            Product(
                name="Classic White Sneakers",
                price=89.99,
                description="Timeless white sneakers crafted from premium leather. Perfect for layering in any season.",
                image="https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
                category="Outdoor"
            ),
            Product(
                name="Classic T-shirt",
                price=89.99,
                description="Timeless white t-shirt crafted from premium cotton. Features a comfortable rubber sole and minimalist design that pairs well with any outfit.",
                image="https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=600",
                category="Shoes"
            ),
            Product(
                name="Denim Jacket",
                price=129.99,
                description="Vintage-inspired denim jacket made from high-quality cotton. Features classic button closures and multiple pockets. Perfect for layering in any season.",
                image="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=600",
                category="Outerwear"
            ),
            Product(
                name="Leather Backpack",
                price=149.99,
                description="Handcrafted leather backpack with spacious compartments. Features adjustable straps and water-resistant lining. Perfect for daily use or travel.",
                image="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600",
                category="Accessories"
            ),
                        Product(
                name="Black T-Shirt",
                price=19.99,
                description="Timeless black t-shirt crafted from premium cotton. Features a comfortable rubber sole and minimalist design that pairs well with any outfit.",
                image="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&q=80&w=600",
                category="Outdoor"
            ),
                        Product(
                name="Jeans",
                price=149.99,
                description="Handcrafted jeans with spacious compartments. Features adjustable straps and water-resistant lining. Perfect for daily use or travel.",
                image="https://images.unsplash.com/photo-1548883354-7622d03aca27",
                category="Outdoor"
            ),
                        Product(
                name="Training shoes",
                price=99.99,
                description="Handcrafted leather training shoes. Perfect for daily use or travel.",
                image="https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600",
                category="Accessories"
            ),
                        Product(
                name="Shoes",
                price=149.99,
                description="Handcrafted leather shoes. Perfect for daily use or work.",
                image="https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&q=80&w=600",
                category="Accessories"
            )
        ]
        db.session.add_all(products)
    
    db.session.commit()

@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    sort = request.args.get('sort')
    
    query = Product.query
    
    if category and category != 'all':
        query = query.filter_by(category=category)
    
    if sort:
        if sort == 'price-asc':
            query = query.order_by(Product.price.asc())
        elif sort == 'price-desc':
            query = query.order_by(Product.price.desc())
        elif sort == 'name-asc':
            query = query.order_by(Product.name.asc())
        elif sort == 'name-desc':
            query = query.order_by(Product.name.desc())
    
    products = query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'image': p.image,
        'category': p.category,
        'description': p.description,
        'created_at': p.created_at.isoformat()
    } for p in products])

@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'image': product.image,
        'category': product.category,
        'description': product.description,
        'created_at': product.created_at.isoformat()
    })

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'count': c.count
    } for c in categories])

@app.route('/api/featured-products', methods=['GET'])
def get_featured_products():
    products = Product.query.limit(3).all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'price': p.price,
        'image': p.image,
        'category': p.category,
        'description': p.description,
        'created_at': p.created_at.isoformat()
    } for p in products])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)