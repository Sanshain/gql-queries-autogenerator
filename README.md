# gql-queries-autogenerator

Autogenerate simplest client queries from graphql types. For example: 


```
type MessageSubType{
  author: String!,
  value: String!
}
```

converts to 

```js
export const messageSubType = gql`
    query MessageSubType {
        author,
        value
    }
`;
```

## Using: 


### cli

```
node index.js targetFile.js
```


### programming:

```js
import {createQueries} from 'gql-queries-generator';
createQueries('d.js', {template: './template.js'})
```

# Installation: 

```
npm i -D gql-queries-generator
```
