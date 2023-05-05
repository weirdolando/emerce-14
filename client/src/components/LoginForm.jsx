import React from "react";
import { Formik, Form, Field } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import userHelper from "../helper/user";
import { getCurrUser } from "../reducers/userSlice";

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box bg="white" p={6} rounded="md" w="80%" maxW={500}>
      <Text fontSize="xl" fontWeight="md" mb={4} textAlign="center">
        Log in
      </Text>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            await userHelper.loginUserAsync(values);
            await dispatch(getCurrUser());
            navigate("/");
          } catch (err) {
            console.log(err.message);
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Email / Password Incorrect",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }}
      >
        {({ errors, touched }) => (
          <Form width="100%">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  variant="filled"
                />
              </FormControl>
            </VStack>
            <Button
              width="100%"
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              _hover={{
                bg: "pink.300",
              }}
              type="submit"
              mt={8}
            >
              Login
            </Button>
            <Text mt={8} textAlign="center">
              Don't have an account?{" "}
              <Button
                as={Link}
                variant={"link"}
                fontWeight={400}
                to="/register"
              >
                Register
              </Button>
            </Text>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterForm;
