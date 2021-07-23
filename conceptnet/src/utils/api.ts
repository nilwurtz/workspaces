import { ConceptNetAPI } from 'api';
import axios from 'axios';

export const getApiData = async (str: string): Promise<ConceptNetAPI | null> => {
  const url = `http://api.conceptnet.io/c/ja/${str}`;
  const JsonData = await axios
    .get(url)
    .then(res => {
      return res.data as ConceptNetAPI;
    })
    .catch(err => {
      console.log(err);
      return null;
    });
  return JsonData;
};
