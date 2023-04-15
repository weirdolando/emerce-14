import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";
import { Flex } from "@chakra-ui/react";

function RegisterLogin({ page = "" }) {
  return (
    <Flex bg="gray.100" align="center" justify="center" h="100vh">
      {page === "register" ? <RegisterForm /> : <LoginForm />}
    </Flex>
  );
}

export default RegisterLogin;
