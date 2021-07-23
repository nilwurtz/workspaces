# from pip
from tensorflow.keras.preprocessing.text import Tokenizer
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.sequence import pad_sequences


class DataLoader():
    """
    seq2seq data loader class
    """

    def load_data(file_path: str):
        """data load method

        Args:
            file_path (str): ファイルパス。ファイルは分かち書きされている状態の文。(間はスペース)

        Returns:
            seq_data: トークン化されたデータ、
            tokenizer: keras tokenizer object
        """
        tokenizer = Tokenizer(filters="")
        whole_texts = []
        for line in open(file_path, encoding='utf-8'):
            whole_texts.append("<s> " + line.strip() + " </s>")

        tokenizer.fit_on_texts(whole_texts)

        return tokenizer.texts_to_sequences(whole_texts), tokenizer


class Data():
    _data_loader = DataLoader

    def __init__(self, train_data_path: str, predict_data_path: str):
        """
        seq2seq data class
        """
        # 読み込み＆Tokenizerによる数値化
        x_train, self.tokenizer_train = self._data_loader.load_data(train_data_path)
        y_train, self.tokenizer_predict = self._data_loader.load_data(predict_data_path)

        self.train_vocab_size = len(self.tokenizer_train.word_index) + 1
        self.predict_vocab_size = len(self.tokenizer_predict.word_index) + 1

        x_train, self.x_test, y_train, self.y_test = train_test_split(x_train,
                                                                      y_train,
                                                                      test_size=0.02,
                                                                      random_state=42)

        # パディング
        self.x_train = pad_sequences(x_train, padding='post')
        self.y_train = pad_sequences(y_train, padding='post')

        self.seqX_len = len(self.x_train[0])
        self.seqY_len = len(self.y_train[0])
