from flask import Flask,render_template,redirect,url_for,request,jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class User(db.Model):  # Changed 'user' to 'db'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(8), nullable=False)

    def __repr__(self) -> str:
        return f"{self.id}-{self.name}"

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        name = request.form['name']
        if User.query.filter_by(name=name).first():
            return jsonify({"status": "error", "message": "Username already taken!"}), 400
        else:
            password = request.form['password']
            new_user = User(name=name, password=password)
            db.session.add(new_user)
            db.session.commit()
            return jsonify({
        "status": "success", 
        "redirect_url": url_for('game') 
    }) # Use url_for with the function name
    return render_template('home.html')

@app.route('/index', methods=['GET', 'POST']) # Added POST method here
def index_page():
    if request.method == 'POST':
        # Fixed: Use model field names 'name' and 'password'
        name = request.form['name']
        password = request.form['password']
        new_entry = User(name=name, password=password)
        db.session.add(new_entry)
        db.session.commit()
    
    all_users = User.query.all()
    return render_template('index.html', allTodo=all_users)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/game',methods=['GET','POST'])
def game():
    return render_template('game.html')

if __name__=="__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)