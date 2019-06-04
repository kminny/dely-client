import { SubscribeToMoreOptions } from "apollo-client";
import React from "react";
import { compose, graphql, MutationFn, Query } from "react-apollo";
import {
  GET_RIDE,
  ME,
  RIDE_EVENTS_SUBSCRIPTION,
  UPDATE_RIDE
} from "../../sharedQueries";
import RidePresenter from "./RidePresenter";

interface IProps {
  location: any;
  history: any;
  UpdateRideMutation: MutationFn;
  MeQuery: any;
}

const ONROUTE = "ONROUTE";
const FINISHED = "FINISHED";
const CANCELED = "CANCELED";
// const REQUESTING = "REQUESTING";

class RideContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    if (!props.location.state) {
      props.history.push("/");
    }
  }
  render() {
    const {
      location: {
        state: { rideId }
      }
    } = this.props;

    return (
      <Query query={GET_RIDE} variables={{ rideId, skip: false }}>
        {({ data, loading, subscribeToMore }) => {
          const subscribeOptions: SubscribeToMoreOptions = {
            document: RIDE_EVENTS_SUBSCRIPTION,
            updateQuery: this.updateQuery
          };
          subscribeToMore(subscribeOptions);
          return (
            <RidePresenter
              data={data}
              loading={loading}
              cancelRide={this.cancelRide}
              pickUp={this.pickUp}
              redirectToChat={this.redirectToChat}
              finishRide={this.finishRide}
            />
          );
        }}
      </Query>
    );
  }
  private updateQuery = (previousData, { subscriptionData }) => {
    const { history } = this.props;
    if (!subscriptionData.data) {
      return previousData;
    }

    const {
      data: {
        rideUpdate: { status }
      }
    } = subscriptionData;

    if (status === CANCELED) {
      history.push("/");
      location.reload();
    }

    if (status === FINISHED) {
      history.push("/");
      location.reload();
    }

    return Object.assign({}, previousData, {
      getRide: {
        ...previousData.getRide,
        ride: {
          ...previousData.getRide.ride,
          status
        }
      }
    });
  };

  private cancelRide = () => {
    const {
      MeQuery: { me: { user: { id = 0 } = {} } = {} } = {},
      location: {
        state: { rideId }
      }
    } = this.props;
    const { UpdateRideMutation } = this.props;
    if (id !== 0) {
      UpdateRideMutation({
        variables: {
          rideId,
          status: CANCELED,
          canceledBy: id
        }
      });
    }
  };

  private pickUp = () => {
    const {
      location: {
        state: { rideId }
      }
    } = this.props;

    const { UpdateRideMutation } = this.props;
    UpdateRideMutation({
      variables: {
        rideId,
        status: ONROUTE
      }
    });
  };

  private finishRide = () => {
    const {
      location: {
        state: { rideId }
      }
    } = this.props;
    const { UpdateRideMutation } = this.props;
    UpdateRideMutation({
      variables: {
        rideId,
        status: FINISHED
      }
    });
  };

  private redirectToChat = () => {
    const { history, location } = this.props;
    const {
      state: { rideId }
    } = location;
    history.push({
      pathname: "/chat",
      state: {
        rideId
      }
    });
  };
}

export default compose(
  graphql(ME, { name: "MeQuery" }),
  graphql<any, any>(UPDATE_RIDE, {
    name: "UpdateRideMutation"
  })
)(RideContainer);
