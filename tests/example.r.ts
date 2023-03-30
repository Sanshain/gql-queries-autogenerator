import gql from "./graphql-tag";



type QueryString<T extends string> = `
    ${'mutation'|'query'} ${T}${string}`


export const register = gql`
    mutation Register {
        register(email: $email, username: $username, password1: $password1, password2: $password2){
            success,
            errors,
            token
        }
    }
` as QueryString<'Register'>;


export const verifyAccount = gql`
    mutation VerifyAccount {
        verifyAccount(token: $token){
            success,
            errors
        }
    }
` as QueryString<'VerifyAccount'>;


export const tokenAuth = gql`
    mutation ObtainJSONWebToken {
        tokenAuth(password: $password, email: $email, username: $username){
            token,
            success,
            errors,
            user{
                id,
                username,
                firstName,
                lastName,
                email,
                isStaff,
                isActive,
                dateJoined,
                placeId
            },
            unarchiving
        }
    }
` as QueryString<'ObtainJSONWebToken'>;


export const updateAccount = gql`
    mutation UpdateAccount {
        updateAccount(firstName: $firstName, lastName: $lastName){
            success,
            errors
        }
    }
` as QueryString<'UpdateAccount'>;


export const postCreate = gql`
    mutation PostMutation {
        postCreate(files: {files: $files, value: $value}, value: $value){
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
        userSettingsMutation(input: {birthday: $birthday, sex: $sex, placeId: $placeId, placeTypeId: $placeTypeId}){
            profile{
                id,
                username,
                firstName,
                lastName,
                dateJoined,
                placeId
            },
            errors{
                field
            },
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


