from flask import Flask, request, redirect, send_from_directory
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
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def hello():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file and allowed_file(file.filename):
            image = file.read()
            result = generate_caption(
                encoder=encoder,
                decoder=decoder,
                image=image
            )
            caption = " ".join(result)
            print(caption)
            return f"<h1>{caption}</h1>"

    return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form method=post enctype=multipart/form-data>
          <input type=file name=file>
          <input type=submit value=Upload>
        </form>
        '''


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
