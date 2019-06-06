import PropTypes from "prop-types";
import React from "react";
import { MutationFn } from "react-apollo";
import { Helmet } from "react-helmet";
import Button from "../../Components/Button";
import Form from "../../Components/Form";
import Header from "../../Components/Header";
import Input from "../../Components/Input";
import { Container, Wrapper } from "../../Components/Shared";

interface IProps {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  age: string;
  loading: boolean;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn;
  getProfileImage: (url: string) => void;
  major: string;
}

const CompleteProfilePresenter: React.SFC<IProps> = ({
  email,
  firstName,
  lastName,
  password,
  age,
  handleInputChange,
  onSubmit,
  loading,
  getProfileImage,
  major
}) => (
  <Wrapper className={"shouldScroll"}>
    <Helmet>
      <title>Complete Profile | dely</title>
    </Helmet>
    <Header backTo={"/"} title={"회원 정보 입력"} />
    <Container>
      <Form onSubmit={onSubmit}>
        <Input
          name={"firstName"}
          value={firstName}
          type={"text"}
          required={true}
          displayName={"이름"}
          onChange={handleInputChange}
        />
        <Input
          name={"lastName"}
          value={lastName}
          type={"text"}
          required={true}
          displayName={"성"}
          onChange={handleInputChange}
        />
        <Input
          name={"major"}
          value={major}
          type={"text"}
          required={true}
          displayName={"소속 학과"}
          onChange={handleInputChange}
        />
        <Input
          name={"email"}
          value={email}
          type={"email"}
          required={true}
          displayName={"이메일 주소"}
          onChange={handleInputChange}
        />
        <Input
          name={"age"}
          value={age}
          type={"number"}
          required={true}
          displayName={"나이"}
          onChange={handleInputChange}
        />
        <Input
          name={"password"}
          value={password}
          type={"password"}
          required={true}
          displayName={"비밀번호"}
          onChange={handleInputChange}
        />
        <Button text={loading ? "적용 중" : "완료"} disabled={loading} />
      </Form>
    </Container>
  </Wrapper>
);

CompleteProfilePresenter.propTypes = {
  email: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  password: PropTypes.string,
  age: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  getProfileImage: PropTypes.func.isRequired
};

export default CompleteProfilePresenter;
