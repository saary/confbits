# confbits

Load configuration bits and get merged configuration by matching criteria

## Config bit structure

A configuration bit can have the following optional fields
 - criteria - a js filter based criteria
 - data - a section that will be merged with the rest of the conf bits
 - priority - the priority in which the data field will be merged
 e.g. priority=0 will be overridden by any other higher priority
 
```
{
  "criteria": {
    "field": "val"
  },
  "data": {
    "some field": "some value"
  },
  priority: 5
}
```

## Usage example

```
const confbits = require('confbits');

const path = require('path');
const co = require('co');
const fs = require('co-fs');

// helper to load bits from a folder
const loadBits = (folderPath) => (
  co(function* () {
    const files = yield fs.readdir(folderPath);

    const bits = [];
    for (let i=0; i<files.length; i++) {
      const filePath = path.join(folderPath, files[i]);
      try {
        const json = yield fs.readFile(filePath, 'utf8');
        bits.push(JSON.parse(json));
      }
      catch (error) {
        console.error('Failed to load', filePath);
      }
    }

    return bits;
  })
);


const conf = confbits({});

loadBits(`${__dirname}/bits`).then((bits) => {
  conf.set(bits);
  
  const subject = { tags: ['a', 'c'] };
  const config = conf.get(subject);
  
  console.log('The merged config for this subject is:', config);
});
```