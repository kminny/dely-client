import { SubscribeToMoreOptions } from "apollo-client";
import throttle from "lodash.throttle";
import React from "react";
import { compose, graphql, MutationUpdaterFn } from "react-apollo";
import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import {
  GET_RIDE,
  ME,
  RIDE_EVENTS_SUBSCRIPTION,
  UPDATE_RIDE
} from "../../sharedQueries";
import { geocode, reverseGeocode } from "../../utils";
import DriverElements from "./DriverElements";
import { IHomeContainerProps, IHomeContainerState } from "./HomeInterfaces";
import HomePresenter from "./HomePresenter";
import {
  GET_DRIVERS,
  GET_NEW_DRIVER,
  GET_RIDE_REQUEST,
  REQUEST_RIDE,
  RIDE_REQUEST_SUBSCRIPTION,
  UPDATE_LOCATION
} from "./HomeQueries";
import UserElements from "./UserElements";

const ACCEPTED = "ACCEPTED";

/*
const Container = styled.div`
  position: absolute;
  margin: auto;
  width: 80vw;
  height: 100vw;
  background-color: white;
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: 5px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
*/

class HomeContainer extends React.Component<
  IHomeContainerProps,
  IHomeContainerState
> {
  mapRef: any;
  map: google.maps.Map;
  userMarker: google.maps.Marker;
  toMarker: google.maps.Marker;
  directionRenderer: google.maps.DirectionsRenderer;
  driverMarkers: google.maps.Marker[];

  constructor(props: IHomeContainerProps) {
    super(props);
    this.state = {
      isMenuOpen: false,
      lat: 0,
      lng: 0,
      toLat: 0,
      toLng: 0,
      toAddress: "",
      fromAddress: "",
      distance: "",
      duration: "",
      price: undefined,
      hasRequest: false,
      request: undefined,
      addedProduct: false,
      status: "idle",
      startAddress: "",
      endAddress: "",
      product: ""
    };

    this.driverMarkers = [];
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );

    window.addEventListener(
      "deviceorientation",
      throttle(this.handleRotation, 5000, { trailing: true, leading: true }),
      true
    );
  }

  componentDidUpdate() {
    const { request } = this.state;

    if (request === "CANCELED") {
      window.location.reload();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      GetRideRequestQuery: { getRideRequest: { ride = null } = {} } = {},
      GetDriversQuery: { getDrivers: { drivers = null } = {} } = {}
    } = nextProps;
    const { MeQuery: { me: { user = null } = {} } = {}, history } = this.props;

    if (drivers) {
      if (this.map) {
        this.drawDrivers(drivers);
      }
    }
    if (ride) {
      this.handleRideRequest(ride);
    }
    if (user) {
      if (user.currentRideId) {
        this.setState({
          status: "requesting"
        });
      }
      if (user.currentRideId && user.isTaken) {
        history.push({
          pathname: "/ride",
          state: {
            rideId: user.currentRideId
          }
        });
      }
    }
  }

  render() {
    const {
      isMenuOpen,
      toAddress,
      price,
      status,
      hasRequest,
      request,
      addedProduct,
      startAddress,
      endAddress,
      product
    } = this.state;
    const {
      MeQuery: { loading, me }
    } = this.props;
    return (
      <HomePresenter
        isMenuOpen={isMenuOpen}
        openMenu={this.openMenu}
        closeMenu={this.closeMenu}
        redirectToEditAccount={this.redirectToEditAccount}
        me={me}
        loading={loading}
        mapRef={this.mapRef}
        showMarker={status === "choosingFromMap"}
      >
        {!loading && me.user.isDriving ? (
          <DriverElements
            hasRequest={hasRequest}
            request={request}
            acceptRide={this.acceptRide}
            cancelRide={this.cancelRide}
          />
        ) : (
          <UserElements
            toAddress={toAddress}
            handleInputChange={this.handleInputChange}
            submitAddress={this.submitAddress}
            toggleMapChoosing={this.toggleMapChoosing}
            chooseMapAddress={this.chooseMapAddress}
            requestRide={this.requestRide}
            price={price}
            status={status}
            cancelRide={this.cancelRide}
            addedProduct={addedProduct}
            addedProductToOpposite={this.addedProductToOpposite}
            startAddress={startAddress}
            endAddress={endAddress}
            product={product}
          />
        )}
      </HomePresenter>
    );
  }

  private addedProductToOpposite = () => {
    const { addedProduct } = this.state;
    this.setState({
      addedProduct: !addedProduct
    });
  };

  private redirectToEditAccount = () => {
    const { history } = this.props;
    history.push("/edit-account");
  };

  private openMenu = () => {
    this.setState({
      isMenuOpen: true
    });
  };

  private closeMenu = () => {
    this.setState({
      isMenuOpen: false
    });
  };

  private handleGeoSuccess: PositionCallback = async (
    position: Position
  ): Promise<void> => {
    const {
      coords: { latitude, longitude }
    } = position;
    const { address, error } = await reverseGeocode(latitude, longitude);
    if (!error) {
      this.setState(
        {
          lat: latitude,
          lng: longitude,
          fromAddress: address
        },
        this.loadMap
      );
    }
  };

  private handleGeoError: PositionErrorCallback = (
    error: PositionError
  ): void => {
    console.log(error);
  };

  private loadMap = (): void => {
    const {
      google,
      GetDriversQuery,
      GetRideRequestQuery,
      MeQuery: { me: { user = {} } = {} }
    } = this.props;

    const { lat, lng } = this.state;
    const maps = google.maps;
    const node = ReactDOM.findDOMNode(this.mapRef.current);
    const mapConfig = {
      center: { lat, lng },
      zoom: 15,
      mapTypeId: "roadmap",
      disableDefaultUI: true
    };
    this.map = new maps.Map(node, mapConfig);
    this.map.addListener("dragend", this.handleCenterChange);
    this.userMarker = new google.maps.Marker({
      position: {
        lat,
        lng
      },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7
      }
    });
    this.userMarker.setMap(this.map);
    const locationOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    navigator.geolocation.watchPosition(
      this.updatePosition,
      this.handleGeoError,
      locationOptions
    );
    if (user && !user.isDriving) {
      const { getDrivers: { drivers = null } = {} } = GetDriversQuery;
      if (drivers) {
        this.drawDrivers(drivers);
        const subscribeOptions: SubscribeToMoreOptions = {
          document: GET_NEW_DRIVER,
          updateQuery: (prev, { subscriptionData }) => {
            const newDriver = subscriptionData.data.getDriver;
            this.drawDrivers([newDriver]);
          }
        };
        GetDriversQuery.subscribeToMore(subscribeOptions);
      }
    }
    if (user && user.isDriving) {
      if (GetRideRequestQuery.getRideRequest) {
        const {
          getRideRequest: { ok, error, ride }
        } = GetRideRequestQuery;
        if (!ok && error) {
          toast.error(error);
        } else if (ok && ride) {
          this.handleRideRequest(ride);
        }
      } else {
        return;
      }
      const subscribeOptions: SubscribeToMoreOptions = {
        document: RIDE_REQUEST_SUBSCRIPTION,
        updateQuery: (_, { subscriptionData }) => {
          const {
            data: { rideRequest }
          } = subscriptionData;
          this.handleRideRequest(rideRequest);
        }
      };
      GetRideRequestQuery.subscribeToMore(subscribeOptions);
    }
  };

  private updatePosition: PositionCallback = (position: Position) => {
    const { ReportLocationMutation } = this.props;
    const {
      coords: { latitude, longitude }
    } = position;
    const latLng = new google.maps.LatLng(latitude, longitude);
    this.userMarker.setPosition(latLng);
    ReportLocationMutation({
      variables: {
        lat: parseFloat(latitude.toFixed(10)),
        lng: parseFloat(longitude.toFixed(10))
      }
    });
  };

  private handleRotation = (event: DeviceOrientationEvent) => {
    const { alpha } = event;
    const { ReportLocationMutation } = this.props;
    ReportLocationMutation({
      variables: {
        lastOrientation: alpha
      }
    });
  };

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

  private submitAddress = async () => {
    const { toAddress, status } = this.state;
    const { lat, lng, error } = await geocode(toAddress);
    if (status !== "choosingFromMap") {
      if (!error) {
        this.setState(
          {
            toLat: lat,
            toLng: lng
          },
          this.createToMarket
        );
      } else {
        toast.error("위치를 찾을 수 없습니다.");
      }
    }
  };

  private toggleMapChoosing = () => {
    this.setState(prevState => {
      if (prevState.status === "idle") {
        return {
          status: "choosingFromMap",
          toLat: 0,
          toLng: 0
        };
      } else {
        return {
          status: "idle",
          toLat: 0,
          toLng: 0
        };
      }
    });
  };

  private handleCenterChange = () => {
    const { status } = this.state;
    if (status === "choosingFromMap") {
      const center = this.map.getCenter();
      const lat = center.lat();
      const lng = center.lng();
      this.setState(
        {
          toLat: lat,
          toLng: lng
        },
        this.hidrateAddress
      );
    }
  };

  private hidrateAddress = async () => {
    const { toLat, toLng } = this.state;
    const { address, error } = await reverseGeocode(toLat, toLng);
    if (!error) {
      this.setState({
        toAddress: address
      });
    } else {
      toast.error("위치를 찾을 수 없습니다.");
    }
  };

  private chooseMapAddress = (): void => {
    const { toLat, toLng } = this.state;
    if (toLat !== 0 && toLng !== 0) {
      this.setState(
        {
          status: "idle"
        },
        this.createToMarket
      );
    }
  };

  /*
  private addProduct = (): void => {
    const {fromAddress, toAddress} = this.state;
    <Container>
        <Form onSubmit={onSubmit}></Form>
    </Container>;
    this.setState(this.createToMarket);
  };
  */

  private createToMarket = (): void => {
    const { toLng, toLat, lat, lng } = this.state;
    if (this.toMarker) {
      this.toMarker.setMap(null);
    }
    this.toMarker = new google.maps.Marker({
      position: {
        lat: toLat,
        lng: toLng
      }
    });
    this.toMarker.setMap(this.map);
    const bounds = new google.maps.LatLngBounds();
    bounds.extend({ lat: toLat, lng: toLng });
    bounds.extend({ lat, lng });
    this.map.fitBounds(bounds);
    this.createPath();
  };

  private createPath = (): void => {
    const { toLat, toLng, lat, lng } = this.state;
    if (this.directionRenderer) {
      this.directionRenderer.setMap(null);
    }
    const rendererOptions: google.maps.DirectionsRendererOptions = {
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#800000"
      }
    };
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    this.directionRenderer = new google.maps.DirectionsRenderer(
      rendererOptions
    );
    const toPlace = new google.maps.LatLng(toLat, toLng);
    const fromPlace = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      origin: fromPlace,
      destination: toPlace,
      travelMode: google.maps.TravelMode.TRANSIT
    };
    this.setState({
      status: "findingDirections"
    });
    directionsService.route(directionsOptions, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const { routes } = result;
        const {
          distance: { text: distance },
          duration: { text: duration }
        } = routes[0].legs[0];
        this.directionRenderer.setDirections(result);
        const price = this.setPrice();
        this.setState({
          status: "foundDirections",
          distance,
          duration,
          price
        });
      } else {
        toast.error("Unable Request Area");
      }
    });
    this.directionRenderer.setMap(this.map);
  };

  private getStraightDistance = () => {
    const { lat, lng, toLat, toLng } = this.state;
    const R = 6371;
    const dLat = this.deg2Rad(toLat - lat);
    const dLng = this.deg2Rad(toLng - lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2Rad(lat)) *
        Math.cos(this.deg2Rad(toLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  private deg2Rad = deg => {
    return deg * (Math.PI / 180);
  };

  private setPrice = () => {
    // set price by straight distance calculated by lat, lng

    const straightDistance: number = this.getStraightDistance();
    const defaultPriceInsideSchool: number = 1300;
    const defaultPriceOutsideSchool: number = 2000;

    // within 2.5km ( inside of the school )
    // 0.28 won per meter
    if (straightDistance < 2.5) {
      return Number(
        (defaultPriceInsideSchool + straightDistance * 1000 * 0.28).toFixed(0)
      );
    } else {
      // over 2.5km ( outside of the school )
      // 50 won per kilometer
      return Number(
        (defaultPriceOutsideSchool + straightDistance * 50).toFixed(0)
      );
    }
  };

  private requestRide = (): void => {
    const { RequestRideMutation } = this.props;
    const {
      lat,
      lng,
      fromAddress,
      toLat,
      toLng,
      toAddress,
      price,
      distance,
      duration,
      startAddress,
      endAddress,
      product
    } = this.state;
    if (toLat === 0 || toLng === 0) {
      toast.error("요청할 수 없습니다. 시작 위치를 설정하세요.");
      return;
    }
    RequestRideMutation({
      variables: {
        pickUpLocation: fromAddress + " " + startAddress,
        pickUpLat: lat,
        pickUpLng: lng,
        dropOffLocation: toAddress + " " + endAddress,
        dropOffLat: toLat,
        dropOffLng: toLng,
        price,
        distance,
        duration,
        product
      },
      update: this.postRequestRide
    });
    this.setState({
      status: "requesting"
    });
  };

  private postRequestRide: MutationUpdaterFn = async (
    cache,
    { data }: { data: any }
  ) => {
    const { requestRide } = data;
    const { GetRideQuery } = this.props;
    if (!requestRide.ok && requestRide.error) {
      toast.error(requestRide.error);
    } else if (requestRide.ok && requestRide.ride) {
      const {
        ride: { id }
      } = requestRide;
      this.setState({
        status: "requesting",
        request: requestRide.ride
      });
      await GetRideQuery.refetch({
        variables: {
          rideId: id,
          skip: false
        }
      });
      const subscribeOptions: SubscribeToMoreOptions = {
        document: RIDE_EVENTS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          const ride = subscriptionData.data.rideUpdate;
          if (ride.status === ACCEPTED) {
            toast.success("배달자를 찾았습니다!");
            this.redirectToRideScreen();
          }
        }
      };
      GetRideQuery.subscribeToMore(subscribeOptions);
    }
  };

  private drawDrivers = (drivers): void => {
    const DRIVER_ID = "driverId";
    if (drivers.length === 0) {
      this.driverMarkers.forEach((marker: google.maps.Marker) => {
        marker.setMap(null);
      });
      this.driverMarkers = [];
    }
    if (this.map) {
      for (const driver of drivers) {
        const { lastLat, lastLng, id: driverId, lastOrientation } = driver;
        const driverPosition: google.maps.LatLng = new google.maps.LatLng(
          lastLat,
          lastLng
        );
        const existingMarker:
          | google.maps.Marker
          | undefined = this.driverMarkers.find(
          (driverMarker: google.maps.Marker) => {
            const markerId = driverMarker.get(DRIVER_ID);
            return markerId === driverId;
          }
        );

        if (existingMarker) {
          existingMarker.setPosition(driverPosition);
          const icon: any = existingMarker.getIcon();
          icon.rotation = lastOrientation;
          existingMarker.setIcon(icon);
        } else {
          const driverSymbol: google.maps.Symbol = {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            rotation: lastOrientation
          };
          const newMarker: google.maps.Marker = new google.maps.Marker({
            position: driverPosition,
            icon: driverSymbol
          });
          newMarker.set(DRIVER_ID, driverId);
          newMarker.setMap(this.map);
          this.driverMarkers.push(newMarker);
        }
      }
    }
  };

  private handleRideRequest = (request): void => {
    this.setState({
      request,
      hasRequest: true
    });
  };

  private acceptRide = () => {
    const { request } = this.state;
    const { UpdateRideMutation, MeQuery } = this.props;
    const {
      me: {
        user: { id }
      }
    } = MeQuery;

    if (request.status === "REQUESTING") {
      UpdateRideMutation({
        variables: {
          status: ACCEPTED,
          rideId: request.id,
          driverId: id
        }
      });
      toast.success("요구를 수락했습니다. 매칭 화면으로 넘어갑니다.");
      this.redirectToRideScreen();
    } else {
      toast.error("이미 다른 배달자에 의해 수락되었습니다..");
      window.location.reload();
    }
  };

  private redirectToRideScreen = () => {
    const { request } = this.state;
    const { history } = this.props;

    setTimeout(() => {
      history.push({
        pathname: "/ride",
        state: {
          rideId: request.id
        }
      });
    }, 1500);
  };

  private cancelRide = () => {
    const { request } = this.state;
    const { UpdateRideMutation } = this.props;
    UpdateRideMutation({
      variables: {
        rideId: request.id,
        status: "CANCELED"
      }
    });
  };
}

export default compose(
  graphql(UPDATE_LOCATION, {
    name: "ReportLocationMutation"
  }),
  graphql(ME, { name: "MeQuery" }),
  graphql(GET_DRIVERS, {
    name: "GetDriversQuery",
    options: {
      pollInterval: 5000
    },
    skip: props => {
      if (props.MeQuery && props.MeQuery.me && props.MeQuery.me.user) {
        return props.MeQuery.me.user.isDriving;
      }
    }
  }),
  graphql(GET_RIDE_REQUEST, {
    name: "GetRideRequestQuery",
    options: {
      pollInterval: 10000
    },
    skip: props => {
      if (props.MeQuery && props.MeQuery.me && props.MeQuery.me.user) {
        const value = props.MeQuery.me.user.isDriving;
        return !value;
      }
      return false;
    }
  }),
  graphql(REQUEST_RIDE, {
    name: "RequestRideMutation"
  }),
  graphql(UPDATE_RIDE, {
    name: "UpdateRideMutation"
  }),
  graphql(GET_RIDE, {
    name: "GetRideQuery",
    options: {
      variables: {
        skip: true
      }
    }
  })
)(HomeContainer);
