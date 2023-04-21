import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  VStack,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
  Collapse,
  Icon,
  Link,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import { Link as RLink } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCurrUser } from "../reducers/userSlice";
import { fetchProducts } from "../reducers/productSlice";

export default function MainNavbar({ filterName, onChange }) {
  const { isOpen, onToggle } = useDisclosure();
  const user = useSelector((state) => state.user.currUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(removeCurrUser());
    navigate("/login");
  };

  // TODO: Use categories from backend and add filter based on category feature
  const NAV_ITEMS = [
    {
      label: "Categories",
      type: "category",
      children: [
        {
          label: "Fashion",
          subLabel: "Clothes, Dresses, Shoes, and more",
          href: "#",
        },
        {
          label: "Electronics",
          subLabel: "Phones, TV, Laptop, and more",
          href: "#",
        },
        {
          label: "Household",
          subLabel: "Toilet paper, Mop, Dishwasher and more",
          href: "#",
        },
      ],
    },
    {
      label: "Search",
      type: "search",
      mobile: "none",
    },
    {
      label: "Cart",
      type: "cart",
      mobileItem: "none",
      children: [],
    },
    {
      label: "Account",
      type: "account",
      mobile: "none",
      children: [
        {
          label: "Profile",
          href: `/${user.username}`,
        },
        {
          label: "Store",
          href: "/store",
        },
        {
          label: "Order History",
          href: "/history",
        },
      ],
    },
  ];

  return (
    <Box>
      <Flex
        bg="white"
        color="gray.600"
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
      >
        <Flex ml={{ base: -2 }} display={{ base: "flex", md: "none" }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justify={{ base: "center", md: "start" }}
          align="center"
        >
          <Text
            as={RLink}
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color="pink.400"
            fontSize="2xl"
            fontWeight={600}
            display={{ base: "none", md: "inline-flex" }}
            to="/"
          >
            tukupedia
          </Text>

          <Flex ml={10} grow={1}>
            <DesktopNav
              user={user}
              filterName={filterName}
              onLogout={logout}
              onChange={onChange}
              dispatch={dispatch}
              navItems={NAV_ITEMS}
            />
          </Flex>
        </Flex>

        {!user.id && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            align="center"
            direction={"row"}
            spacing={6}
            display={{ base: "none", md: "inline-flex" }}
          >
            <Box color="gray.400">|</Box>
            <Button
              as={RLink}
              fontSize={"sm"}
              fontWeight={400}
              variant={"link"}
              to="/login"
            >
              Log in
            </Button>

            <Button
              as={RLink}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              _hover={{
                bg: "pink.300",
              }}
              to="/register"
            >
              Register
            </Button>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={NAV_ITEMS} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({
  user = {},
  onLogout,
  filterName,
  onChange,
  dispatch,
  navItems: NAV_ITEMS,
}) => {
  const linkColor = "gray.600";
  const linkHoverColor = "gray.800";
  const popoverContentBgColor = "white";
  const handleEnter = (e) => {
    if (e.key === "Enter") dispatch(fetchProducts(`?name=${filterName}`));
  };

  return (
    <Flex align="center" gap={4} w="100%">
      {NAV_ITEMS.map((navItem) => (
        <Box
          key={navItem.label}
          w={navItem.type === "search" && "100%"}
          display={
            (navItem.type === "category" || navItem.type === "cart") && {
              base: "none",
              md: "inline-flex",
            }
          }
        >
          {navItem.type === "category" ? (
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <RLink
                  p={2}
                  to={navItem.href ?? "#"}
                  fontSize={"sm"}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: "none",
                    color: linkHoverColor,
                  }}
                >
                  {navItem.label}
                </RLink>
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={"xl"}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={"xl"}
                  minW={"sm"}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          ) : navItem.type === "cart" ? (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<AiOutlineShoppingCart />}
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              />
              {navItem.children && (
                <MenuList bg="white" borderColor="gray.200">
                  {navItem.children.map((child) => (
                    <MenuItem
                      key={child.label}
                      href={child.href ? child.href : "#"}
                    >
                      {child.label}
                    </MenuItem>
                  ))}
                  <MenuDivider />
                  <MenuItem>See cart</MenuItem>
                </MenuList>
              )}
            </Menu>
          ) : navItem.type === "search" ? (
            <Box>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  type="text"
                  placeholder="Search in tukupedia"
                  onChange={onChange}
                  onKeyUp={handleEnter}
                  name="name"
                />
              </InputGroup>
            </Box>
          ) : navItem.type === "account" && user.id ? (
            <Flex alignItems={"center"} ml={4}>
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <HStack>
                    <Avatar
                      size={"sm"}
                      src={
                        "https://www.punchstick.com/wp-content/uploads/2017/12/default-user-image-300x300.png"
                      }
                    />
                    <VStack
                      display="flex"
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text
                        fontSize="sm"
                        maxW="50px"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {user.firstname}
                      </Text>
                    </VStack>
                    <Box display="flex">
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                {navItem.children && (
                  <MenuList bg="white" borderColor="gray.200">
                    {navItem.children.map((child) => (
                      <MenuItem
                        as={RLink}
                        key={child.label}
                        to={child.href ? child.href : "#"}
                      >
                        {child.label}
                      </MenuItem>
                    ))}
                    <MenuDivider />
                    <MenuItem onClick={onLogout}>Sign Out</MenuItem>
                  </MenuList>
                )}
              </Menu>
            </Flex>
          ) : null}
        </Box>
      ))}
    </Flex>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: "pink.50" }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = ({ navItems: NAV_ITEMS }) => {
  return (
    <Stack bg="white" p={4} display={{ md: "none" }}>
      {NAV_ITEMS.map((navItem) => {
        return (
          navItem.mobile !== "none" && (
            <MobileNavItem key={navItem.label} {...navItem} />
          )
        );
      })}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, mobileItem }) => {
  const { isOpen, onToggle } = useDisclosure();

  const hideMobileItem = mobileItem === "none";

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text fontWeight={600} color="gray.600">
          {label}
        </Text>
        {children && !hideMobileItem && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      {!hideMobileItem && (
        <Collapse
          in={isOpen}
          animateOpacity
          style={{ marginTop: "0!important" }}
        >
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={"solid"}
            borderColor="gray.200"
            align={"start"}
          >
            {children &&
              children.map((child) => (
                <Link key={child.label} py={2} href={child.href}>
                  {child.label}
                </Link>
              ))}
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
};
