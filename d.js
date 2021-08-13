import gql from "./graphql-tag";

export const postCreate = gql`
    mutation postCreate {
        postCreate(value: $value, files: $files){
            post{
                id,
                by,
                time,
                value,
                files,
                message
            }
        }
    }
`;

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
            dateJoined,
            avatar,
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
            talkersAmount,
            lastMessage {
                author,
                value,
            }
        }
    }
`;

