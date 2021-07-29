import gql from "./graphql-tag";

export const messageType = gql`
    query MessageType {
        messages (id: $id) {
            id,
            time,
            value,
            author
        }
    }
`;

export const userType = gql`
    query UserType {
        user (id: $id) {
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
    }
`;

export const dialogType = gql`
    query DialogType {
        dialog (id: $id) {
            id,
            avatar,
            title,
            talkersAmount
        }
    }
`;

