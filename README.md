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

## Installation: 

```
npm i -D gql-queries-generator
```

## Using: 


### cli

```
node index.js targetFile.js
```


### programming:

```js
const createQueries = require('gql-queries-generator').createQueries;
// or `import {createQueries} from 'gql-queries-generator';`
createQueries('d.js', {template: './template.js'})
```


# Advanced usage: 

## Possible options: 

- **template** - `string` - template for the generated file
- **exclude** - `string[]` - list of types to ignore when generating
- **include** - `{base: string[], complex: {[key: QueryName]: args: RootFieldName, fields: {[key: fieldName]: fields[]}}}` - by default, gql-queries-generator generates queries only for basic types. Such requests will contain one type and a description of all its fields. In this case, such a request will ignore nested types. The `include` option allows you to describe more complex queries that the graphql server returns. For example:

```json
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


## Typescript support:

**template** option allows you to specify any file extension, including `.ts`. In the latter case, the `QueryString` type will be automatically added to the description of queries and according string annotation. It is assumed that `QueryString` has the following description:

```ts
type QueryString<T extends string> = `\n    ${'mutation'|'query'} ${T}${string}`
```

but its may be overriten inside template (look up `template` option). If templte does not contains `QueryString` type, its'll be added automatically (template must have also `.ts` extension. Else assumed `QueryString` type as global type)


Further the `QueryString<T>` may be use to integrate the tool with `graphql-types-generator` via extracting according type from `QueryTypes` (look up `graphql-types-generator` documentation) or with `@graphql-codegen/typescript-operations`, but in the last case its require some additional tuning.



