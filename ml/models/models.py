from models.image_captions import (
    CNN_Encoder,
    RNN_Decoder
)
import tensorflow as tf
import pickle


def get_encoder(embedding_dim, path):
    model = CNN_Encoder.CNN_Encoder(embedding_dim)
    model.compile(loss='sparse_categorical_crossentropy', optimizer=tf.keras.optimizers.Adam())
    model.load_weights(path)
    return model


def get_decoder(embedding_dim, units, vocab_size, path):
    model = RNN_Decoder.RNN_Decoder(embedding_dim, units, vocab_size)
    model.compile(loss='sparse_categorical_crossentropy', optimizer=tf.keras.optimizers.Adam())
    model.load_weights(path)
    return model


def get_image_extraction_model():
    image_model = tf.keras.applications.InceptionV3(include_top=False, weights='imagenet')
    new_input = image_model.input
    hidden_layer = image_model.layers[-1].output

    image_features_extract_model = tf.keras.Model(new_input, hidden_layer)
    return image_features_extract_model


def get_caption_tokenizer():
    with open('../app/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
    return tokenizer
