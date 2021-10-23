import gql from "./graphql-tag";

export const postCreate = gql`
    mutation postCreate {
        postCreate(value: $value, files: $files){
            post{
                id,
                time,
                value,
                files
            }
        }
    }
`;

export const likeApply = gql`
    mutation likeApply {
        likeApply(post: $post){
            increased
        }
    }
`;

export const postType = gql`
    query PostType {
        posts (user: $user) {
            id,
            by {
                id,
            },
            time,
            value,
            files
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

