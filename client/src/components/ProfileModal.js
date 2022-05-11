import { Avatar, Box, Modal } from "@mui/material";
import React from "react";
import Visibility from "@mui/icons-material/Visibility";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProfileModal = ({ user, children }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const IP = process.env.REACT_APP_IMAGE_PATH;

  return (
    <div>
      {children ? (
        <span onClick={handleOpen}>{children}</span>
      ) : (
        <Visibility onClick={handleOpen} style={{ cursor: "pointer" }} />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="userInfo" style={{ marginLeft: "1rem" }}>
            <Avatar src={IP + user.dp} />
            <br />
            <h3>Name</h3>
            <span style={{ color: "gray" }}>{user.name}</span>
            <br />
            <br />
            <h3>Email</h3>
            <span style={{ color: "gray" }}>{user.email}</span>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ProfileModal;
