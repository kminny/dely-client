import React from "react";
import { graphql, Mutation, MutationUpdaterFn } from "react-apollo";
import { toast } from "react-toastify";
import { ME } from "../../sharedQueries";
import EditAccountPresenter from "./EditAccountPresenter";
import { UPDATE_ACCOUNT } from "./EditAccountQueries";

interface IState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  profilePhoto: string;
  major: string;
}

class EditAccountContainer extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      profilePhoto: "",
      major: ""
    };
  }

  componentWillReceiveProps(newProps) {
    const {
      data: { me }
    } = newProps;
    if (me) {
      const { ok, user } = me;
      if (ok) {
        const {
          firstName,
          lastName,
          phoneNumber,
          email,
          profilePhoto,
          major
        } = user;
        this.setState({
          firstName,
          lastName,
          phoneNumber,
          email,
          profilePhoto,
          major
        });
      }
    }
  }

  render() {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      profilePhoto,
      major
    } = this.state;
    return (
      <Mutation
        mutation={UPDATE_ACCOUNT}
        variables={{
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
          profilePhoto,
          major
        }}
        update={this.handlePostSubmit}
        refetchQueries={[{ query: ME }]}
      >
        {(updateAccount, { loading }) => (
          <EditAccountPresenter
            firstName={firstName}
            lastName={lastName}
            phoneNumber={phoneNumber}
            email={email}
            handleInputChange={this.handleInputChange}
            onSubmit={updateAccount}
            loading={loading}
            password={password}
            profilePhoto={profilePhoto}
            major={major}
            getProfileImage={this.getProfileImage}
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
    const { updateUser } = data;
    if (!updateUser.ok && updateUser.error) {
      toast.error(updateUser.error);
    } else if (updateUser.ok) {
      toast.success("성공적으로 업데이트 되었습니다.");
    }
  };

  private getProfileImage = (url: string): void => {
    this.setState({
      profilePhoto: url
    });
  };
}

export default graphql(ME)(EditAccountContainer);
