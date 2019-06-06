import React from "react";
import { Mutation, MutationUpdaterFn, Query } from "react-apollo";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { ME } from "../../../sharedQueries";
import MenuPresenter from "./MenuPresenter";
import { TOGGLE_DRIVING } from "./MenuQueries";

class MenuContainer extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.postToggleDriving = this.postToggleDriving.bind(this);
  }
  render() {
    return (
      <Query query={ME}>
        {({ loading, error, data }) => (
          <Mutation
            update={this.postToggleDriving}
            mutation={TOGGLE_DRIVING}
            variables={{ isDriving: data.me ? !data.me.user.isDriving : false }}
            refetchQueries={[{ query: ME }]}
          >
            {toggleDriving => (
              <MenuPresenter
                loading={loading}
                data={data}
                toggleDriving={toggleDriving}
              />
            )}
          </Mutation>
        )}
      </Query>
    );
  }
  private postToggleDriving: MutationUpdaterFn = (
    cache,
    { data }: { data: any }
  ) => {
    const { updateUser } = data;
    if (!updateUser.ok && updateUser.error) {
      toast.error(updateUser.error);
    } else if (updateUser.ok) {
      if (updateUser.user) {
        const {
          user: { isDriving }
        } = updateUser;
        const query: any = cache.readQuery({ query: ME });
        query.me.user.isDriving = isDriving;
        cache.writeQuery({ query: ME, data: query });
        if (isDriving) {
          toast.success("Dely 시작합니다!");
        } else {
          toast.success("잠시 휴식..");
        }
      }
    }
  };
}

export default withRouter(MenuContainer);
