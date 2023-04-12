import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Profile() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [username, setUserName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // function to signup user:
  const handleProfileUpdate = async () => {
    let prevEmail = localStorage.getItem("email");

    try {
      await axios
        .put("http://localhost:5000/api/user/profile", {
          username,
          newEmail,
          prevEmail,
        })
        .then((result) => {
          // toast.success("Nft created successfully");
          toast.success(" profile updated successfully");
          localStorage.setItem("email", newEmail);
          navigate("/");
          // setTimeout(() => {
          //   window.location.reload(true);
          // }, "2000");
        })

        .catch((error) => toast.error(error.response.data.message));
    } catch (error) {
      console.log("catch error: ", error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      let prevEmail = localStorage.getItem("email");
      // console.log(parEmail);
      const { data } = await axios.get(
        `http://localhost:5000/api/user/profile/${prevEmail}`
      );
      //   console.log(data);

      if (data) {
        setNewEmail(data.email);
        setUserName(data.username);
      } else {
        setNewEmail("");
        setUserName("");
      }
    };
    fetchUserData();
  }, []);

  return (
    <Flex
      minH={"90vh"}
      align={"center"}
      justify={"center"}
      fontFamily={"sans-serif"}
      bg="#f2fffe"
    >
      <Stack spacing={8} mx={"auto"} minW={"lg"} py={10} px={6}>
        <Stack align={"center"}>
          <Heading
            fontSize={"5xl"}
            fontWeight="semi-bold"
            textAlign={"center"}
            fontFamily={"auto"}
            textColor="#0d8775"
          >
            UPDATE ACCOUNT
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          border="2px"
          borderColor="gray.200"
        >
          <Stack spacing={4}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="name"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </FormControl>

            <Stack spacing={10} pt={2}>
              <Button
                onClick={handleProfileUpdate}
                marginX="auto"
                backgroundColor="black"
                textColor="white"
                width="100%"
                paddingY="1.4em"
                _hover={{
                  backgroundColor: "blackAlpha.800",
                }}
              >
                UPDATE
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
