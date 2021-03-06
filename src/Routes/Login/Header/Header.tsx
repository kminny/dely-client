import { tween } from "popmotion";
import PropTypes from "prop-types";
import React from "react";
import posed from "react-pose";
import styled from "styled-components";
import bg from "../../../images/bg.png";
import { loginMethodType } from "../LoginTypes";

const PosedHeader = posed.div({
  closed: {
    maxHeight: "100px",
    opacity: 0,
    transition: (props: any) => tween({ ...props, duration: 300 })
  },
  open: {
    maxHeight: "1000px",
    opacity: 1,
    transition: (props: any) => tween({ ...props, duration: 300 })
  }
});

const StyledHeader = styled<any, any>(PosedHeader)`
  background: linear-gradient(rgba(0, 153, 196, 0.5), rgba(0, 153, 196, 0.4)),
    url(${bg});
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
  will-change: max-height, opacity;
  top: 0;
`;

const Logo = styled.span`
  width: 110px;
  height: 110px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 -14px 28px rgba(0, 0, 0, 0.22);
  text-transform: uppercase;
  font-weight: 500;
  font-size: 25px;
`;

interface IHeader {
  onClick: () => void;
  loginMethod: loginMethodType;
}

const Header: React.SFC<IHeader> = ({ onClick, loginMethod }) => (
  <StyledHeader onClick={onClick} pose={loginMethod === "" ? "open" : "closed"}>
    <Logo>Dely</Logo>
  </StyledHeader>
);

Header.propTypes = {
  onClick: PropTypes.func.isRequired,
  loginMethod: PropTypes.string.isRequired
};

export default Header;
