import React from "react";
import { Mutation, Query } from "react-apollo";
import SettingsPresenter from "./SettingsPresenter";
import { ACCOUNT_QUERY, LOG_OUT } from "./SettingsQuery";

class SettingsContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Mutation mutation={LOG_OUT}>
        {logUserOut => (
          <Query query={ACCOUNT_QUERY}>
            {({ data, loading }) => (
              <SettingsPresenter
                logUserOut={logUserOut}
                loading={loading}
                data={data}
                onErrorRefresh={this.onErrorRefresh}
              />
            )}
          </Query>
        )}
      </Mutation>
    );
  }

  private onErrorRefresh = () => {
    location.reload();
  };
}

export default SettingsContainer;
