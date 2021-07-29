import gql from "./graphql-tag";

export const userNode = gql`
    query UserNode {
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

export const node = gql`
    query Node {
        id
    }
`;

export const dialogType = gql`
    query DialogType {
        id,
        avatar,
        title,
        talkersAmount
    }
`;

export const userType = gql`
    query UserType {
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

export const messageType = gql`
    query MessageType {
        id,
        time,
        value,
        author
    }
`;

export const messageSubType = gql`
    query MessageSubType {
        author,
        value
    }
`;

export const register = gql`
    query Register {
        success,
        token
    }
`;

export const verifyAccount = gql`
    query VerifyAccount {
        success
    }
`;

export const obtainJSONWebToken = gql`
    query ObtainJSONWebToken {
        token,
        success,
        unarchiving
    }
`;

export const updateAccount = gql`
    query UpdateAccount {
        success
    }
`;

export const __Type = gql`
    query __Type {
        name,
        description
    }
`;

export const __Field = gql`
    query __Field {
        name,
        description,
        isDeprecated,
        deprecationReason
    }
`;

export const __InputValue = gql`
    query __InputValue {
        name,
        description,
        defaultValue
    }
`;

export const __EnumValue = gql`
    query __EnumValue {
        name,
        description,
        isDeprecated,
        deprecationReason
    }
`;

export const __Directive = gql`
    query __Directive {
        name,
        description
    }
`;

