import gql from "./graphql-tag";



type QueryString<T extends string> = `
    ${'mutation'|'query'} ${T}${string}`


export const postCreate = gql`
    mutation PostMutation {
        postCreate(files: $files, value: $value){
            post{
                id,
                time,
                value,
                files
            }
        }
    }
` as QueryString<'PostMutation'>;


export const likeApply = gql`
    mutation LikeMutation {
        likeApply(postId: $postId){
            increased
        }
    }
` as QueryString<'LikeMutation'>;


export const friendshipApply = gql`
    mutation FriendshipMutation {
        friendshipApply(userId: $userId){
            added
        }
    }
` as QueryString<'FriendshipMutation'>;


export const userSettingsMutation = gql`
    mutation SettingsMutationPayload {
        userSettingsMutation(birthday: $birthday, sex: $sex, placeId: $placeId, placeTypeId: $placeTypeId){
            profile{
                id,
                username,
                firstName,
                lastName,
                dateJoined,
                placeId
            },
            errors,
            settings{
                firstName
            },
            clientMutationId
        }
    }
` as QueryString<'SettingsMutationPayload'>;


export const userType = gql`
    query UserType {
        user (id: $id) {
            id,
            lastLogin,
            username,
            firstName,
            lastName,
            dateJoined,
            avatar,
            sex,
            placeId,
            name,
            image,
            friendshipState
        }
    }
` as QueryString<'UserType'>;


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
` as QueryString<'PostType'>;


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
` as QueryString<'DialogType'>;


