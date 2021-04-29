from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from functions.predictions import generate_caption
from models.models import get_encoder, get_decoder

UPLOAD_FOLDER = 'app/assets'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'jfif'}

BATCH_SIZE = 64
BUFFER_SIZE = 1000
embedding_dim = 256
units = 512
vocab_size = 5000 + 1
features_shape = 2048
attention_features_shape = 64

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resources={r"/caption": {"origins": "http://localhost:3000"}})


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/caption', methods=['POST'])
@cross_origin(origin="localhost", headers=["Content-Type"])
def caption():
    if request.method == 'POST':
        # check if the post request has the file part
        image = None
        file = None
        if 'file' not in request.files:
            image = request.get_json()['image']
        else:
            file = request.files['file']
        if file and allowed_file(file.filename):
            image = file.read()
        result = generate_caption(
            encoder=encoder,
            decoder=decoder,
            image=image
        )
        generated_caption = " ".join(result[:-1])
        return jsonify({"generated_caption": generated_caption})


if __name__ == '__main__':
    global decoder, encoder
    decoder = get_decoder(
        embedding_dim=embedding_dim,
        units=units,
        vocab_size=vocab_size,
        path='models/image_captions/decoder/decoder'
    )
    encoder = get_encoder(
        embedding_dim=embedding_dim,
        path='models/image_captions/encoder/encoder'
    )
    app.run(port=5000, debug=True, host='0.0.0.0')
