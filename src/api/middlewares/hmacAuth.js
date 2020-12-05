// eslint-disable-next-line
const debug = require('debug')('zc:authentication');
const createError = require('http-errors');
const R = require('ramda');
const CryptoJS = require('crypto-js');

/**
 *
 * StringToSign = HTTP-Verb + "\n" + RequestURI + "\n" + Timestamp
 * signature = Base64(HMAC-SHA-256(StringToSign, accessSecret))
 */
module.exports = (queryUserService) => async (req, res, next) => {
  const authStr = R.propOr('', 'authorization', req.headers);
  const timestamp = R.propOr('', 'x-timestamp', req.headers);
  const { method } = req;
  const url = req.originalUrl;

  if (R.or(R.isEmpty(authStr), R.isEmpty(timestamp))) {
    return next(createError(401, 'hmac auth is required'));
  }

  const [, accessKeyId, signature] = R.match(/^hmac (.+)=(.+)/, authStr);

  if (R.isNil(accessKeyId)) {
    return next(createError(401, 'hmac auth format error'));
  }

  const data = await queryUserService.getUserByAccessKeyId(accessKeyId);

  if (R.isNil(data)) {
    return next(createError(401, 'unknown user'));
  }

  const { accessSecret, name, email } = data;
  const stringToSign = `${method}\n${url}\n${timestamp}`;
  const sign = CryptoJS.HmacSHA256(stringToSign, accessSecret).toString(CryptoJS.enc.Base64);

  if (sign !== signature) {
    return next(createError(401, 'invalid signature'));
  }

  // keep the user info for future usage
  res.locals.user = { name, email };

  return next();
};
