import React, { useState, useEffect } from "react";
import {
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  useDisclosure,
  Box,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import FileStorageMarketplace from "../../FileStorageMarketplace.json";
import { ethers } from "ethers";
import JSEncrypt from "jsencrypt";
import Pagination from "../../components/Pagination/Pagination";
import axios from "axios";
import Loader from "../../components/Loader/Loader";

const AllReceivedFiles = () => {
  const [recievedFiles, setRecievedFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recievedFiles.slice(indexOfFirstItem, indexOfLastItem);
  const showPagination = recievedFiles.length > itemsPerPage ? true : false;

  const click = async (hash) => {
    console.log("click");
    let encryptor = new JSEncrypt({ default_key_size: 2048 });

    const { data } = await axios.post(
      "http://localhost:5000/api/hash/getPrivateKey",
      {
        hashvalue: hash,
      }
    );

    encryptor.setPrivateKey(data.privateKey);
    let decrypted = encryptor.decrypt(hash);
    console.log(decrypted);
    window.open(decrypted, "_blank");
  };

  useEffect(() => {
    const fetchAllMySharedFiles = async () => {
      // Connect to the contract using ethers.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        FileStorageMarketplace.address,
        FileStorageMarketplace.abi,
        signer
      );

      // Call the getAllMyUploadedFiles() function and retrieve the files
      const files = await contract.getAllMyReceivedFiles();

      console.log("recieved files: ", files);
      // Set the files state variable
      setRecievedFiles(files);
      setLoading(false);
    };

    fetchAllMySharedFiles();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box paddingY="10" paddingX="4em" minHeight={"90vh"}>
          <Text
            mb={"2"}
            fontSize="5xl"
            textAlign="center"
            textTransform="uppercase"
            textColor="#0d8775"
            fontFamily="auto"
          >
            Dashboard
          </Text>

          <Text
            mb={"5"}
            fontSize="3xl"
            textAlign="center"
            textTransform="uppercase"
            textColor="#0d8775"
            fontFamily="auto"
          >
            All My Received Files
          </Text>

          {/* Tables */}

          <TableContainer>
            <Table size="md" border="1px" borderColor="gray.200">
              <Thead>
                <Tr>
                  <Th paddingY="1em" fontSize="xl">
                    File Name
                  </Th>
                  <Th fontSize="xl">File Hash</Th>
                  <Th fontSize="xl">Shared By</Th>
                </Tr>
              </Thead>

              <Tbody>
                {recievedFiles.length === 0 ? (
                  <Tr>
                    <Text fontSize="3xl" textAlign="center" paddingY={10}>
                      You haven't shared any file
                    </Text>
                  </Tr>
                ) : (
                  currentItems.map((data, i) => (
                    <Tr key={i}>
                      <Td>{data?.name}</Td>
                      <Td>
                        <Link
                          fontWeight="light"
                          fontSize="md"
                          onClick={() => click(data.hash)}
                          isExternal
                        >
                          {data.hash.slice(0, 20) +
                            "..." +
                            data.hash.slice(-20)}{" "}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>

                      <Td>{`${data?.owner?.slice(
                        0,
                        16
                      )}....${data?.owner?.slice(-8)}`}</Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
          {showPagination && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={recievedFiles.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default AllReceivedFiles;