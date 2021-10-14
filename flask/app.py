from flask import Flask, render_template, request
from clustering.clustering import countInitialData, countDistances

countInitialData()

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/clustering', methods=["POST"])
def clustering():
    request_data = request.get_json()
    target = request_data['vector']
    distances = countDistances(target)
    response = {'distances': distances}
    return response


if __name__ == '__main__':
    app.run(debug=True, port=5000)