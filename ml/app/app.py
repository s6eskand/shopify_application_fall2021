from flask import Flask, request, jsonify
from flask_cors import CORS
from functions.predictions import generate_caption, search_images
from models.models import get_encoder, get_decoder, get_image_extraction_model, get_caption_tokenizer

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
CORS(
    app,
    allow_headers=[
        'Content-Type',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Methods'
    ]
)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.after_request
def apply_caching(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET,OPTIONS,POST"
    response.headers["Access-Control-Allow-Headers"] = \
        "Access-Control-Allow-Headers,  Access-Control-Allow-Origin, Origin,Accept, " + \
        "X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    return response


@app.route('/caption', methods=['POST'])
def caption():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            image = file.read()
            result = generate_caption(
                encoder=encoder,
                decoder=decoder,
                image=image,
                image_features_extraction=image_features_extract_model,
                tokenizer=tokenizer
            )
            generated_caption = " ".join(result[:-1])
            return jsonify({"generated_caption": generated_caption})
        else:
            return jsonify({"error": "Invalid file in request body."}), 400


@app.route('/search', methods=['POST'])
def search():
    if request.method == 'POST':
        image = None
        file = request.files['file']
        images = request.form.get("images")
        if file and allowed_file(file.filename):
            image = file.read()
        similar_images = search_images(
            encoder=encoder,
            decoder=decoder,
            image=image,
            image_features_extraction=image_features_extract_model,
            tokenizer=tokenizer,
            images=images
        )
        return jsonify({"similar_images": similar_images})


if __name__ == '__main__':
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
    image_features_extract_model = get_image_extraction_model()
    tokenizer = get_caption_tokenizer()
    app.run(port=5000, debug=True, host='0.0.0.0')
