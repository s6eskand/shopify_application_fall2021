import tensorflow as tf
import requests
import json
from heapq import heapify, heappop, heappush


def calc_max_length(tensor):
    return max(len(t) for t in tensor)


def load_image(image):
    img = image
    if isinstance(image, str):
        img = requests.get(img).content
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.resize(img, (299, 299))
    img = tf.keras.applications.inception_v3.preprocess_input(img)
    return img


def tokenize_caption(caption):
    freq = {}
    for word in caption:
        if word != "<unk>":
            if word in freq:
                freq[word] += 1
            else:
                freq[word] = 1
    return freq


def compare_captions(caption1, caption2):
    count = 0
    for key in caption1:
        if key in caption2:
            count += caption1[key]
    return count


def generate_caption(encoder, decoder, image, image_features_extraction, tokenizer):
    max_length = 50

    hidden = decoder.reset_state(batch_size=1)

    temp_input = tf.expand_dims(load_image(image), 0)
    img_tensor_val = image_features_extraction(temp_input)
    img_tensor_val = tf.reshape(img_tensor_val, (img_tensor_val.shape[0], -1, img_tensor_val.shape[3]))

    features = encoder(img_tensor_val)

    dec_input = tf.expand_dims([tokenizer.word_index['<start>']], 0)
    result = []

    for i in range(max_length):
        predictions, hidden, attention_weights = decoder(dec_input, features, hidden)

        predicted_id = tf.random.categorical(predictions, 1)[0][0].numpy()
        result.append(tokenizer.index_word[predicted_id])

        if tokenizer.index_word[predicted_id] == '<end>':
            return result

        dec_input = tf.expand_dims([predicted_id], 0)

    return result


def search_images(encoder, decoder, image, image_features_extraction, tokenizer, images):
    caption = generate_caption(encoder, decoder, image, image_features_extraction, tokenizer)

    subject = tokenize_caption(caption[:-1])
    heap = []
    heapify(heap)
    images_json = json.loads(images)
    for img in images_json:
        compare = img["caption"]
        score = compare_captions(subject, compare)
        heappush(heap, (score * -1, img["pk"]))

    similar_images = []
    i = 0
    while i < 5:
        similar_images.append(heappop(heap)[1])
        i += 1

    return similar_images
