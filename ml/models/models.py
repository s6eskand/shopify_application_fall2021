from models.image_captions import (
    CNN_Encoder,
    RNN_Decoder
)
import tensorflow as tf


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
