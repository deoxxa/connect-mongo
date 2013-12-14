# connect-mongolotion

MongoDB session store for Connect (NOW WITH MORE LOTION FOR EASIER INSERTION)

This is forked from [connect-mongo](https://github.com/kcbanner/connect-mongo);
all the swearing is my own. Please don't complain to Casey if you're offended.
Unless he offended you. Then complain to him. I'm not bothering to maintain the
tests. Fuck programming.

## Installation

connect-mongolotion will just fucking work, unlike you, you lazy shit.

via npm:

```sh
npm install connect-mongolotion
```

## Options

The options are the same as those for the second parameter of [mongoskin.db](https://github.com/kissjs/node-mongoskin#dbserverurls-dboptions-replicasetoptions),
except that we pull out the `url` and `defaultValidityPeriod` parameters for
quite predictable purposes.

## Example

```js
var connect = require("connect"),
    MongoStore = require("connect-mongolotion");

app.use(express.session({
  secret: settings.cookie_secret,
  store: new MongoStore({
    url: "localhost:12345/mydatabase",
  }),
}));
```

## Removing expired sessions

connect-mongolotion uses MongoDB's TTL collection feature (2.2+) to
have mongod automatically remove expired sessions. (mongod runs this
check every minute.)

**Note:** By connect/express's default, session cookies are set to 
expire when the user closes their browser (maxAge: null). In accordance
with standard industry practices, connect-mongolotion will set these sessions
to expire two weeks from their last "set". You can override this 
behavior by manually setting the maxAge for your cookies -- just keep in
mind that any value less than 60 seconds is pointless, as mongod will
only delete expired documents in a TTL collection every minute.

For more information, consult connect's [session documentation](http://www.senchalabs.org/connect/session.html)

## License 

(The MIT License)

Copyright (c) 2011 Casey Banner &lt;kcbanner@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
