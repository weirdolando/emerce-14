import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import YupPassword from "yup-password";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Box,
  Flex,
  Spacer,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import userHelper from "../helper/user";

YupPassword(Yup);

const phoneRegExp =
  /^(\+\d{1,2}\s?)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,}$/gm;
const RegisterSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().password().min(6).minSymbols(0).required(),
  username: Yup.string().min(3).required(),
  firstname: Yup.string().min(3).required(),
  lastname: Yup.string().min(3).required(),
  phone: Yup.string().matches(phoneRegExp, "Invalid phone number").required(),
});

const RegisterForm = () => {
  const navigate = useNavigate();

  return (
    <Box bg="white" p={6} rounded="md" w="80%" maxW={500}>
      <Text fontSize="xl" fontWeight="md" mb={4} textAlign="center">
        Register
      </Text>
      <Formik
        initialValues={{
          email: "",
          password: "",
          username: "",
          firstname: "",
          lastname: "",
          phone: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          userHelper
            .registerUserAsync(values)
            .then((res) => {
              Swal.fire({
                position: "center",
                icon: "success",
                title: res.message,
                showConfirmButton: false,
                timer: 1500,
              });
              setTimeout(() => {
                navigate("/login");
              }, 1500);
            })
            .catch((err) => {
              console.log(err.message);
              Swal.fire({
                position: "center",
                icon: "error",
                title: "Username / Email already exists",
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }}
      >
        {({ errors, touched }) => (
          <Form width="100%">
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email} isRequired>
                <FormLabel>Email</FormLabel>
                <Field
                  as={Input}
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                />
                {errors.email && touched.email ? (
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isInvalid={errors.password} isRequired>
                <FormLabel>Password</FormLabel>
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type="password"
                  variant="filled"
                />
                {errors.password && touched.password ? (
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                ) : null}
              </FormControl>
              <FormControl isInvalid={errors.username} isRequired>
                <FormLabel>Username</FormLabel>
                <Field
                  as={Input}
                  id="username"
                  name="username"
                  type="text"
                  variant="filled"
                />
                {errors.username && touched.username ? (
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                ) : null}
              </FormControl>
              <Flex gap={2} width="100%">
                <FormControl isInvalid={errors.firstname} isRequired>
                  <FormLabel>Firstname</FormLabel>
                  <Field
                    as={Input}
                    id="firstname"
                    name="firstname"
                    type="text"
                    variant="filled"
                  />
                  {errors.firstname && touched.firstname ? (
                    <FormErrorMessage>{errors.firstname}</FormErrorMessage>
                  ) : null}
                </FormControl>
                <Spacer />
                <FormControl isInvalid={errors.lastname} isRequired>
                  <FormLabel>Lastname</FormLabel>
                  <Field
                    as={Input}
                    id="lastname"
                    name="lastname"
                    type="text"
                    variant="filled"
                  />
                  {errors.lastname && touched.lastname ? (
                    <FormErrorMessage>{errors.lastname}</FormErrorMessage>
                  ) : null}
                </FormControl>
              </Flex>
              <FormControl isInvalid={errors.phone} isRequired>
                <FormLabel>Phone</FormLabel>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  type="tel"
                  variant="filled"
                />
                {errors.phone && touched.phone ? (
                  <FormErrorMessage>{errors.phone}</FormErrorMessage>
                ) : null}
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
              Register
            </Button>
            <Text mt={8} textAlign="center">
              Have an account?{" "}
              <Button as={Link} variant={"link"} fontWeight={400} to="/login">
                Log in
              </Button>
            </Text>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default RegisterForm;
