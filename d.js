import gql from "./graphql-tag";

export const postCreate = gql`
    mutation postCreate {
        postCreate(files: $files, value: $value){
            post{
                id,
                time,
                value,
                files
            }
        }
    }
`;

export const postType = gql`
    query PostType {
        posts (user: $user) {
            id,
            time,
            value,
            files
        }
    }
`;

export const messageType = gql`
    query MessageType {
        messages (id: $id) {
            id,
            time,
            value,
            files,
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

