import gql from "./graphql-tag";

export const userNodeFragment = gql`
    fragment userNode on UserNode {
        id,
        lastLogin,
        username,
        firstName,
        lastName,
        email,
        isStaff,
        isActive,
        dateJoined,
        avatar,
        pk,
        archived,
        verified,
        secondaryEmail
    }
`;

export const nodeFragment = gql`
    fragment node on Node {
        id
    }
`;

export const dialogTypeFragment = gql`
    fragment dialogType on DialogType {
        id,
        avatar,
        title,
        talkersAmount
    }
`;

export const userTypeFragment = gql`
    fragment userType on UserType {
        id,
        lastLogin,
        username,
        firstName,
        lastName,
        email,
        isStaff,
        isActive,
        dateJoined,
        avatar,
        isSuperuser,
        name,
        image
    }
`;

export const messageTypeFragment = gql`
    fragment messageType on MessageType {
        id,
        time,
        value,
        author
    }
`;

export const messageSubTypeFragment = gql`
    fragment messageSubType on MessageSubType {
        author,
        value
    }
`;

export const registerFragment = gql`
    fragment register on Register {
        success,
        token
    }
`;

export const verifyAccountFragment = gql`
    fragment verifyAccount on VerifyAccount {
        success
    }
`;

export const obtainJSONWebTokenFragment = gql`
    fragment obtainJSONWebToken on ObtainJSONWebToken {
        token,
        success,
        unarchiving
    }
`;

export const updateAccountFragment = gql`
    fragment updateAccount on UpdateAccount {
        success
    }
`;

export const __TypeFragment = gql`
    fragment __Type on __Type {
        name,
        description
    }
`;

export const __FieldFragment = gql`
    fragment __Field on __Field {
        name,
        description,
        isDeprecated,
        deprecationReason
    }
`;

export const __InputValueFragment = gql`
    fragment __InputValue on __InputValue {
        name,
        description,
        defaultValue
    }
`;

export const __EnumValueFragment = gql`
    fragment __EnumValue on __EnumValue {
        name,
        description,
        isDeprecated,
        deprecationReason
    }
`;

export const __DirectiveFragment = gql`
    fragment __Directive on __Directive {
        name,
        description
    }
`;

