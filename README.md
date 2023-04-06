# gql-queries-autogenerator

Autogenerate simplest client queries from graphql types.

#### What does it do?

It converts graphql types to appropriate queries with javascript syntax like so:

**from**:

```graphql
type MessageSubType{
  author: String!,
  value: String!
}
```

**to**: 

```js
export const messageSubType = gql`
    query MessageSubType {
        author,
        value
    }
`;
```

#### Installation: 

```shell
npm i -D gql-queries-generator
```

## How to use? 

Graphql server should be running on port 8000

### via cli:

Generate queries to `target.js`:

```shell script
gq-gen ./target.js
```

or the same without installation:

```shell
npx gql-queries-autogenerator ./target.js
```

#### Possible advanced options: 

- `--template` - specifies template file name that will be used to generate the target file
- `-p` - number port of graphql server if it differs from the default one

### via programming (more powerfull):

Programming usage allows to specify more options

```js
const createQueries = require('gql-queries-generator').createQueries;

// or `import {createQueries} from 'gql-queries-generator';`

createQueries('d.js', {
    template: './template.js',
    // another options (look up below)
})
```

#### Possible options: 

- **port** - `number` - number port of graphql server if it differs from the `8000`
- **host** - `string` - host name of graphql server if it differs from the `127.0.0.1`
- **template** - `string` - template for the generated file
- **exclude** - `string[]` - list of types to ignore when generating
- **include** - `{base: string[], complex: {[key: QueryName]: args: RootFieldName, fields: {[key: fieldName]: fields[]}}}` - by default, gql-queries-generator generates queries only for basic types. Such requests will contain one type and a description of all its fields. In this case, such a request will ignore nested types. The `include` option allows you to describe more complex queries that the graphql server returns. For example:

  ```js
  include: {
      base: [],
      complex: {
          posts: {
              args: ["user"],
              fields: {
                  by: ["id"]
              }
          }
      }
  }
  ```

  will generate: 

  ```js
  export const postType = gql`
      query PostType {
          posts (user: $user) {
              id,
              by {
                  id,
              },
              time,
              value,
              files,
              likesCount,
              rated
          }
      }
  `
  ```

  where `PostType` is operation name automatically picked up from the server


<hr>






# Advanced usage: 


## Typescript support:

**template** option allows you to specify any file extension, including `.ts`. In the latter case, the `QueryString` type will be automatically added to the description of queries and according string annotation like this: 

```ts
export const likeApply = gql`
    mutation LikeMutation {
        likeApply(postId: $postId){
            increased
        }
    }
` as QueryString<'LikeMutation'>;
```


It is assumed that `QueryString` has the following description:

```ts
type QueryString<T extends string> = `\n    ${'mutation'|'query'} ${T}${string}`
```

but its may be overriten inside template (look up `template` option). If templte does not contains `QueryString` type, its'll be added automatically (template must have also `.ts` extension. Else assumed `QueryString` type as global type)


Further the `QueryString<T>` may be use to integrate the tool with `graphql-types-generator` via extracting according type from `QueryTypes` (look up `graphql-types-generator` documentation) or with `@graphql-codegen/typescript-operations`, but in the last case its require some additional tuning.



