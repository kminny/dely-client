import PropTypes from "prop-types";
import React from "react";
import { MutationFn } from "react-apollo";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";

const Container = styled.div`
  width: 100%;
  padding: 0 15px;
  padding-top: 150px;
`;

const Wrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
`;

interface IProps {
  email: string;
  password: string;
  loading: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn;
}

const EmailLoginPresenter: React.SFC<IProps> = ({
  email,
  password,
  handleInputChange,
  loading,
  onSubmit
}) => (
  <Wrapper className={"shouldScroll"}>
    <Helmet>
      <title>Login with Email | dely</title>
    </Helmet>
    <Header backTo="/" title={"이메일 로그인"} />
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={handleInputChange}
          value={email}
          type="email"
          required={true}
          name={"email"}
          displayName={"이메일 주소"}
        />
        <Input
          onChange={handleInputChange}
          value={password}
          type="password"
          required={true}
          name={"password"}
          displayName={"비밀번호"}
        />
        <Button text={loading ? "요청 중" : "로그인"} disabled={loading} />
      </Form>
    </Container>
  </Wrapper>
);

EmailLoginPresenter.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default EmailLoginPresenter;
