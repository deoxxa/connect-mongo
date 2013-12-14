/*!
 * connect-mongolotion
 * Original Copyright(c) 2011 Casey Banner <kcbanner@gmail.com>
 * Modifications by Conrad Pankoff <deoxxa@fknsrs.biz>
 * MIT Licensed
 */

var connect = require("connect"),
    mongo = require("mongoskin");

// grab ahold of `Store`

var Store = connect.session.Store;

/**
 * Initialize MongoStore with the given `options`.
 * Calls `cb` when db connection is ready (mainly for testing purposes).
 *
 * @param {Object} options
 * @param {Function} cb
 * @api public
 */

var MongoStore = module.exports = function MongoStore(options, cb) {
  options = options || {};

  Store.call(this, options);

  this.db = mongo.db(options.url, options);
  this.collection = this.db.collection(options.collection || "sessions");

  if (options.stringify) {
    this._serialize_session = JSON.stringify;
    this._unserialize_session = JSON.parse;
  } else {
    this._serialize_session = function(session) {
      // easy deep copy
      return JSON.parse(JSON.stringify(session));
    };

    this._unserialize_session = function(session) {
      return session;
    };
  }

  this.defaultValidityPeriod = options.defaultValidityPeriod || (1000 * 60 * 60 * 24 * 14);
};

/**
 * Inherit from `Store`.
 */

MongoStore.prototype = Object.create(Store.prototype, {constructor: {value: MongoStore}});

/**
 * Attempt to fetch session by the given `sid`.
 *
 * @param {String} sid
 * @param {Function} cb
 * @api public
 */

MongoStore.prototype.get = function(sid, cb) {
  var self = this;

  return this.collection.findOne({_id: sid}, function(err, session) {
    if (err) {
      return cb(err);
    }

    if (session) {
      if (!session.expires || new Date() < session.expires) {
        return cb(null, self._unserialize_session(session.session));
      } else {
        return self.destroy(sid, cb);
      }
    } else {
      return cb();
    }
  });
};

/**
 * Commit the given `session` object associated with the given `sid`.
 *
 * @param {String} sid
 * @param {Session} session
 * @param {Function} callback
 * @api public
 */

MongoStore.prototype.set = function(sid, session, cb) {
  var s = {
    _id: sid,
    session: this._serialize_session(session),
  };

  if (session && session.cookie && session.cookie.expires) {
    s.expires = new Date(session.cookie.expires);
  } else {
    // If there's no expiration date specified, it is
    // browser-session cookie or there is no cookie at all,
    // as per the connect docs.
    //
    // So we set the expiration to two-weeks from now
    // - as is common practice in the industry (e.g Django) -
    // or the default specified in the options.
    s.expires = new Date(Date.now() + this.defaultValidityPeriod);
  }

  return this.collection.update({_id: sid}, s, {upsert: true, safe: true}, cb);
};

/**
 * Destroy the session associated with the given `sid`.
 *
 * @param {String} sid
 * @param {Function} cb
 * @api public
 */

MongoStore.prototype.destroy = function(sid, cb) {
  return this.collection.remove({_id: sid}, cb);
};

/**
 * Fetch number of sessions.
 *
 * @param {Function} cb
 * @api public
 */

MongoStore.prototype.length = function(cb) {
  return collection.count({}, cb);
};

/**
 * Clear all sessions.
 *
 * @param {Function} callback
 * @api public
 */

MongoStore.prototype.clear = function(cb) {
  return collection.drop(cb);
};
