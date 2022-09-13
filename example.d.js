import gql from "./graphql-tag";

export const postCreate = gql`
    mutation PostMutation {
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
    mutation LikeMutation {
        likeApply(postId: $postId){
            increased
        }
    }
`;

export const friendshipApply = gql`
    mutation FriendshipMutation {
        friendshipApply(userId: $userId){
            added
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
            files,
            likesCount,
            rated
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
            isStaff,
            dateJoined,
            avatar,
            sex,
            placeId,
            name,
            image,
            isFriend
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

