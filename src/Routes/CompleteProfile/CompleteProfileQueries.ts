import gql from "graphql-tag";

export const EMAIL_SIGN_UP = gql`
  mutation emailSignUp(
    $phoneNumber: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $password: String!
    $age: Int!
    $profilePhoto: String!
    $major: String!
  ) {
    emailSignUp(
      phoneNumber: $phoneNumber
      email: $email
      firstName: $firstName
      lastName: $lastName
      password: $password
      age: $age
      profilePhoto: $profilePhoto
      major: $major
    ) {
      ok
      token
      error
    }
  }
`;
