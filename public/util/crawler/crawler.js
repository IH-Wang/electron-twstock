const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const getCharset = (str) => {
  const charset = ((str && str.match(/charset=['"]?([\w.-]+)/i)) || [
    0,
    null,
  ])[1];
  return charset && charset.replace(/:\d{4}$|[^0-9a-z]/g, '') === 'gb2312'
    ? 'gbk'
    : charset;
};
const handleCrawler = async (url, evaluate) => {
  const { data, headers } = await axios.get(url, {
    responseType: 'arraybuffer',
    responseEncoding: 'binary',
  });
  const contentType = headers['content-type']
    .split(';')
    .filter((item) => item.trim().length !== 0)
    .join(';');
  const charset = getCharset(contentType) || 'utf8';
  const decodeData = iconv.decode(data, charset);
  const $ = cheerio.load(decodeData);
  return evaluate($);
};

module.exports = handleCrawler;
