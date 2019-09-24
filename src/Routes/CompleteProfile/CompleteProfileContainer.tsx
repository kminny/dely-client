import React from "react";
import { graphql, Mutation, MutationFn, MutationUpdaterFn } from "react-apollo";
import { toast } from "react-toastify";
import person from "../../../src/images/person.png";
import { LOG_USER_IN } from "../../sharedQueries";
import CompleteProfilePresenter from "./CompleteProfilePresenter";
import { EMAIL_SIGN_UP } from "./CompleteProfileQueries";

interface IState {
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  age: string;
  profilePhoto: string;
  major: string;
}

interface IProps {
  logUserIn: MutationFn;
  location: any;
  history: any;
}

class CompleteProfileContainer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    if (!props.location.state) {
      props.history.push("/");
    }
    const {
      location: { state }
    } = props;
    let phoneNumber = "";
    if (state) {
      phoneNumber = state.phone;
    } else {
      phoneNumber = "";
    }
    this.state = {
      phoneNumber,
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      age: "",
      profilePhoto: person,
      major: ""
    };
  }
  render() {
    const {
      email,
      firstName,
      lastName,
      password,
      age,
      phoneNumber,
      profilePhoto,
      major
    } = this.state;
    return (
      <Mutation
        mutation={EMAIL_SIGN_UP}
        update={this.handlePostSubmit}
        variables={{
          phoneNumber,
          email,
          firstName,
          lastName,
          password,
          age,
          profilePhoto,
          major
        }}
      >
        {(emailSignUp, { loading }) => (
          <CompleteProfilePresenter
            email={email}
            firstName={firstName}
            lastName={lastName}
            password={password}
            age={age}
            handleInputChange={this.handleInputChange}
            loading={loading}
            onSubmit={emailSignUp}
            getProfileImage={this.getProfileImage}
            major={major}
          />
        )}
      </Mutation>
    );
  }

  private handleInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const {
      target: { value, name }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  private handlePostSubmit: MutationUpdaterFn = (
    cache,
    { data }: { data: any }
  ) => {
    const { emailSignUp } = data;
    console.log(emailSignUp);
    const { logUserIn } = this.props;
    if (!emailSignUp.ok && emailSignUp.error) {
      toast.error(emailSignUp.error);
    } else if (emailSignUp.token) {
      console.log(emailSignUp.token);
      logUserIn({ variables: { token: emailSignUp.token } });
    }
  };

  private getProfileImage = (url: string): void => {
    this.setState({
      profilePhoto: person
    });
  };
}
export default graphql<any, any>(LOG_USER_IN, { name: "logUserIn" })(
  CompleteProfileContainer
);
