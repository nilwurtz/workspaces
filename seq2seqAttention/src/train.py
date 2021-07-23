"""
seq2seq + Attention model
based on dl4us by matsuo-lab
https://github.com/matsuolab-edu/dl4us/blob/master/lesson4/lesson4_sec4_exercise.ipynb
"""

# default
import os
from datetime import datetime

# from pip
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Activation, Embedding, Dense, LSTM, concatenate, dot
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
# selfmade
if __name__ == "__main__":
    from pretrain import Data
else:
    from .pretrain import Data


BASE_PATH = os.path.dirname(os.path.dirname(__file__))


class Models():
    emb_dim = 256
    hid_dim = 256
    att_dim = 256

    def __init__(self,
                 seqX_len: int,
                 seqY_len: int,
                 train_vocab_size: int,
                 predict_vocab_size: int):
        self.seqX_len = seqX_len
        self.seqY_len = seqY_len
        self.train_vocab_size = train_vocab_size
        self.predict_vocab_size = predict_vocab_size

        self._initialize()

        self.encoder_inputs, self.encoded_seq, self.encoder_states = self._set_encoder()
        self.decoder_inputs, self.decoded_seq = self._set_decoder()
        self.attention_outputs = self._set_attention()

    def _initialize(self):
        """共通部分の抜き出し"""
        # decoder
        self.decoder_embedding = Embedding(self.predict_vocab_size, self.emb_dim)
        self.decoder_lstm = LSTM(self.hid_dim,
                                 return_sequences=True, return_state=True)
        # attention
        self.score_dense = Dense(self.hid_dim)
        self.attention_dense = Dense(self.att_dim, activation='tanh')
        self.output_dense = Dense(self.predict_vocab_size, activation='softmax')

    def _set_encoder(self):
        # 符号化器
        encoder_inputs = Input(shape=(self.seqX_len,))
        encoder_embedded = Embedding(self.train_vocab_size,
                                     self.emb_dim,
                                     mask_zero=True)(encoder_inputs)
        encoded_seq, *encoder_states = LSTM(self.hid_dim,
                                            return_sequences=True,
                                            return_state=True)(encoder_embedded)

        return encoder_inputs, encoded_seq, encoder_states

    def _set_decoder(self):
        # 復号化器（encoder_statesを初期状態として指定）
        decoder_inputs = Input(shape=(self.seqY_len,))
        decoder_embedded = self.decoder_embedding(decoder_inputs)
        decoded_seq, _, _ = self.decoder_lstm(decoder_embedded,
                                              initial_state=self.encoder_states)
        return decoder_inputs, decoded_seq

    def _set_attention(self):

        # shape: (seqY_len, hid_dim) -> (seqY_len, hid_dim)
        score = self.score_dense(self.decoded_seq)
        # shape: [(seqY_len, hid_dim), (seqX_len, hid_dim)] -> (seqY_len, seqX_len)
        score = dot([score, self.encoded_seq], axes=(2, 2))
        # shape: (seqY_len, seqX_len) -> (seqY_len, seqX_len)
        attention = Activation('softmax')(score)
        # shape: [(seqY_len, seqX_len), (seqX_len, hid_dim)] -> (seqY_len, hid_dim)
        context = dot([attention, self.encoded_seq], axes=(2, 1))
        # shape: [(seqY_len, hid_dim), (seqY_len, hid_dim)] -> (seqY_len, 2*hid_dim)
        concat = concatenate([context, self.decoded_seq], axis=2)

        # shape: (seqY_len, 2*hid_dim) -> (seqY_len, att_dim)
        attentional = self.attention_dense(concat)

        # shape: (seqY_len, att_dim) -> (seqY_len, ja_vocab_size)
        outputs = self.output_dense(attentional)
        return outputs

    def set_model(self):
        model = Model([self.encoder_inputs, self.decoder_inputs],
                      self.attention_outputs)
        model.compile(optimizer='rmsprop',
                      loss='sparse_categorical_crossentropy')
        # model.summary()
        return model

    def generator(self):
        encoder_model = Model(self.encoder_inputs, [
                              self.encoded_seq] + self.encoder_states)

        decoder_states_inputs = [Input(shape=(self.hid_dim,)), Input(shape=(self.hid_dim,))]

        decoder_inputs = Input(shape=(1,))
        decoder_embedded = self.decoder_embedding(decoder_inputs)
        decoded_seq, *decoder_states = self.decoder_lstm(decoder_embedded,
                                                         initial_state=decoder_states_inputs)

        decoder_model = Model([decoder_inputs] + decoder_states_inputs, [decoded_seq] + decoder_states)

        # Attention
        encoded_seq_in, decoded_seq_in = (Input(shape=(self.seqX_len, self.hid_dim)),
                                          Input(shape=(1, self.hid_dim)))
        score = self.score_dense(decoded_seq_in)
        score = dot([score, encoded_seq_in], axes=(2, 2))
        attention = Activation('softmax')(score)
        context = dot([attention, encoded_seq_in], axes=(2, 1))
        concat = concatenate([context, decoded_seq_in], axis=2)
        attentional = self.attention_dense(concat)
        attention_outputs = self.output_dense(attentional)

        attention_model = Model([encoded_seq_in, decoded_seq_in], [attention_outputs, attention])
        return encoder_model, decoder_model, attention_model


class Trainer():
    @staticmethod
    def run(model, x_train, y_train, save_dir):
        train_target = np.hstack(
            (y_train[:, 1:], np.zeros((len(y_train), 1), dtype=np.int32)))

        model.fit([x_train, y_train], np.expand_dims(train_target, -1),
                  batch_size=128, epochs=10, verbose=1, validation_split=0.2)
        model.save(os.path.join(save_dir, 'model.h5'), include_optimizer=False)


class Decoder():
    def __init__(self, encoder_model, decoder_model, attention_model, tokenizer_train, tokenizer_predict):
        self.encoder_model = encoder_model
        self.decoder_model = decoder_model
        self.attention_model = attention_model
        self.tokenizer_train = tokenizer_train
        self.tokenizer_predict = tokenizer_predict

    def decode_sequence(self, input_seq, bos_eos, max_output_length=1000):
        encoded_seq, *states_value = self.encoder_model.predict(input_seq)

        target_seq = np.array(bos_eos[0])  # bos_eos[0]="<s>"に対応するインデックス
        output_seq = bos_eos[0][:]
        attention_seq = np.empty((0, len(input_seq[0])))

        while True:
            decoded_seq, *states_value = self.decoder_model.predict([target_seq] + states_value)
            output_tokens, attention = self.attention_model.predict([encoded_seq, decoded_seq])
            sampled_token_index = [np.argmax(output_tokens[0, -1, :])]
            output_seq += sampled_token_index
            attention_seq = np.append(attention_seq, attention[0], axis=0)

            if (sampled_token_index == bos_eos[1] or len(output_seq) > max_output_length):
                break

            target_seq = np.array(sampled_token_index)
        return output_seq, attention_seq

    def decode_from_test(self, x_test, y_test, seqX_len):
        detokenizer_train = dict(map(reversed, self.tokenizer_train.word_index.items()))
        detokenizer_predict = dict(map(reversed, self.tokenizer_predict.word_index.items()))

        # add
        detokenizer_predict[0] = "unk"
        len_tests = range(len(x_test))

        for test_idx in len_tests:
            input_seq = pad_sequences([x_test[test_idx]], seqX_len, padding='post')
            bos_eos = self.tokenizer_predict.texts_to_sequences(["<s>", "</s>"])

            output_seq, attention_seq = self.decode_sequence(input_seq, bos_eos)
            print(f"test: {test_idx}")
            print('元の文:', ' '.join([detokenizer_train[i] for i in x_test[test_idx]]))
            print('生成文:', ' '.join([detokenizer_predict[i] for i in output_seq]))
            print('正解文:', ' '.join([detokenizer_predict[i] for i in y_test[test_idx]]))


def main():
    time_stamp = datetime.now().strftime("%Y%m%d%_H%M%S")
    MODEL_SAVE_DIR = os.path.join(BASE_PATH, "save", time_stamp)
    if not os.path.isdir(MODEL_SAVE_DIR):
        print(f">>> create model save directory...")
        print(f">>> {MODEL_SAVE_DIR}...")
        os.makedirs(MODEL_SAVE_DIR)

    print(f">>> loading data...")
    data = Data(train_data_path=os.path.join(BASE_PATH, "data", "train.en"),
                predict_data_path=os.path.join(BASE_PATH, "data", "train.ja"))
    print(f">>> making model...")
    model = Models(seqX_len=data.seqX_len,
                   seqY_len=data.seqY_len,
                   train_vocab_size=data.train_vocab_size,
                   predict_vocab_size=data.predict_vocab_size)
    print(f">>> running train...")
    Trainer.run(model.set_model(), data.x_train, data.y_train, MODEL_SAVE_DIR)
    print(f">>> making models...")
    encoder_model, decoder_model, attention_model = model.generator()
    print(f">>> making decoder...")
    decoder = Decoder(encoder_model=encoder_model,
                      decoder_model=decoder_model,
                      attention_model=attention_model,
                      tokenizer_train=data.tokenizer_train,
                      tokenizer_predict=data.tokenizer_predict)
    print(f">>> decoding...")
    decoder.decode_from_test(x_test=data.x_test,
                             y_test=data.y_test,
                             seqX_len=data.seqX_len)


if __name__ == "__main__":
    main()
