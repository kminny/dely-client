import PropTypes from "prop-types";
import React from "react";
import FontAwesome from "react-fontawesome";
import { Helmet } from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "styled-components";
import Marker from "../../Components/Marker";
import { IHomePresenterProps } from "./HomeInterfaces";
import Menu from "./Menu";

const Container = styled.div`
  height: 100%;
`;

const Icon = styled.button`
  height: 50px;
  width: 50px;
  position: absolute;
  top: 15px;
  left: 8px;
  font-size: 26px;
  -webkit-appearance: none;
  border: 0;
  z-index: 1;
  background-color: transparent;
  cursor: pointer;
  &:focus {
    outline: none;
  }
`;

const Map = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 0;
`;

class HomePresenter extends React.Component<IHomePresenterProps> {
  static propTypes = {
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    me: PropTypes.object,
    redirectToVerify: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    showMarker: PropTypes.bool.isRequired
  };
  render() {
    const {
      openMenu,
      isMenuOpen,
      closeMenu,
      mapRef,
      children,
      showMarker
    } = this.props;
    return (
      <Container>
        <Helmet>
          <title>Home | dely</title>
        </Helmet>
        <Sidebar
          open={isMenuOpen}
          sidebar={<Menu />}
          styles={{
            sidebar: {
              width: "80%",
              backgroundColor: "white",
              zIndex: "10"
            }
          }}
          onSetOpen={closeMenu}
        >
          {/* {!loading &&
            me.user.verifiedPhoneNumber && (
              <Icon onClick={openMenu}>
                <FontAwesome name={"bars"} />
              </Icon>
            )} */}
          <Icon onClick={openMenu}>
            <FontAwesome name={"bars"} />
          </Icon>
        </Sidebar>

        {showMarker && <Marker />}
        <Map innerRef={mapRef} />
        {children}
      </Container>
    );
  }
}
export default HomePresenter;
