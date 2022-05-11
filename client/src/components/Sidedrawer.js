import React, { useEffect, useState } from "react";
import "./Sidedrawer.css";
import Search from "@mui/icons-material/Search";
import { AppState } from "../context/ContextProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserList from "./UserList";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Tooltip,
  Menu,
  Drawer,
  Button,
  Input,
  Skeleton,
} from "@mui/material";
import Notification from "./Notification";

const Sidedrawer = () => {
  let {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = AppState();
  user = user.data;

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  // if you are using useEffect and want to show when page refresh
  // const [imgPath, setImgPath] = useState("");

  const IP = process.env.REACT_APP_IMAGE_PATH;

  // profile
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) navigate("/login");
  }, []);

  const logoutHandle = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  // drawer
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/chat/create",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoading(false);
      setSelectedChat(data);
      handleClose();
    } catch {
      alert("something wrong");
    }
  };
  const searchHandle = async () => {
    if (!search) {
      alert("enter something in search input");
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/users?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      setLoading(false);
      console.log(data);

      setSearchResult(data.users);
      setSearch("");

      // setImgPath(IP + user.userlog.dp);
    } catch (error) {
      alert("failed to load search result");
    }
  };
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    ></Box>
  );

  return (
    <div className="sidedrawer">
      <div className="sidedrawerContainer">
        <div className="sidedrawerLeft">
          {["left"].map((anchor) => (
            <React.Fragment key={anchor}>
              <Search />
              <input
                type="text"
                placeholder="Search user"
                onClick={toggleDrawer(anchor, true)}
              />
              <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
              >
                <h3 style={{ textAlign: "center", marginTop: "1rem" }}>
                  Search Users
                </h3>

                <Input
                  style={{ marginTop: "1rem", padding: "0.5rem" }}
                  placeholder="search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button style={{ marginTop: "0.5rem" }} onClick={searchHandle}>
                  Search
                </Button>
                {loading ? (
                  <>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                  </>
                ) : (
                  searchResult?.map((userr) => {
                    return (
                      <UserList
                        key={userr._id}
                        user={userr}
                        handleFunction={() => accessChat(userr._id)}
                      />
                    );
                  })
                )}
                {list(anchor)}
              </Drawer>
            </React.Fragment>
          ))}
        </div>
        <div className="sidedrawerMid">
          <h2>Chat-App &nbsp;</h2>{" "}
          <span>(&nbsp;{user.userlog.name}&nbsp;)</span>
        </div>
        <div className="sidedrawerRight">
          <Notification
            notification={notification}
            setNotification={setNotification}
          />
        </div>
        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              style={{ marginRight: "2rem" }}
            >
              <Avatar
                sx={{ width: 32, height: 32 }}
                src={IP + user.userlog.dp}
              />
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          // onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          // anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        >
          <div className="menuOpt">
            <ProfileModal user={user.userlog}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <Divider />
            <MenuItem style={{ color: "red" }} onClick={logoutHandle}>
              Logout
            </MenuItem>
          </div>
        </Menu>
      </div>
    </div>
  );
};

export default Sidedrawer;
