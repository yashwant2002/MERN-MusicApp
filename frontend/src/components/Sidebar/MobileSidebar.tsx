import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Logout, CloudUpload, AccountCircle } from "@mui/icons-material";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import SearchIcon from "@mui/icons-material/Search";
import PushPinIcon from "@mui/icons-material/PushPin";
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  Drawer,
  Menu,
  MenuItem,
  TextField,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import AuthDialog from "../Auth/AuthDialog";
import { useAuth } from "../../store/AuthContext";
import UploadMusicDialog from "../Music/UploadMusicDialog";
import { IoAdd } from "react-icons/io5";
import Logo from "../../utils/Logo";
import CreatePlaylist from "../Playlist/CreatePlaylist";
import axiosInstance from "../../utils/axiosInstance";
import { usePlaylist } from "../../store/PlaylistContext";
import SearchList from "./SearchList";

export default function MobileSidebar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useAuth();
  const { playlists, fetchPlaylists } = usePlaylist();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [openFrom, setOpenFrom] = useState(false);
  const [openPlaylistForm, setOpenPlaylistForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!isMobile && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile, open]);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleDrawerToggle = () => {
    setOpen((prev) => !prev);
    console.log("Open state toggled:", !open);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await axiosInstance.get(`/api/songs/songName/${query}`);
      // console.log(response.data);

      setResults(response.data);
      setOpenElement(true);
    } catch (error) {
      console.error("Failed to search songs:", error);
    }
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleUploadOpen = () => {
    setOpenFrom(true);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={`w-full h-15 flex items-center z-1000 fixed ${
        scrolled
          ? " bg-[#030303]  shadow-[0px 4px 10px rgba(0, 0, 0, 0.5)] border-b-[0.5px] border-solid border-b-gray-500"
          : "bg-transparent"
      }`}
    >
      <div className="flex gap-3 w-full">
        <button className="ml-3" onClick={toggleDrawer(true)}>
          <MenuIcon />
        </button>
        <div>
          <Logo />
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <button onClick={() => setOpenSearch(true)}>
          <SearchIcon />
        </button>
        <div>
          {user ? (
            <>
              <Button
                onClick={handleMenuOpen}
                className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg shadow-lg backdrop-blur-md hover:bg-white/20 transition-all duration-300 flex items-center"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "white",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {user?.firstName
                    ? user.firstName.charAt(0).toUpperCase()
                    : "?"}
                </Avatar>
              </Button>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#1e1e1e",
                    color: "#fff",
                  },
                }}
              >
                <MenuItem disabled sx={{ opacity: 0.7 }}>
                  <ListItemIcon>
                    <AccountCircle sx={{ color: "gray" }} />
                  </ListItemIcon>
                  {user.firstName || "Guest"}
                </MenuItem>
                <Divider sx={{ backgroundColor: "#444" }} />
                <MenuItem onClick={handleUploadOpen}>
                  <ListItemIcon>
                    <CloudUpload sx={{ color: "#fff" }} />
                  </ListItemIcon>
                  Upload Music
                </MenuItem>

                <MenuItem onClick={logout} sx={{ color: "#f44336" }}>
                  <ListItemIcon>
                    <Logout sx={{ color: "#f44336" }} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <button
              onClick={() => setDialogOpen(true)}
              className="px-5 py-2 mr-3 bg-white/10 border border-white/20 text-white rounded-lg shadow-lg backdrop-blur-md hover:bg-white/20 transition-all duration-300"
            >
              Login
            </button>
          )}
        </div>
      </div>
      <Dialog
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            position: "fixed",
            top: 20,
            margin: 0,
            borderRadius: 0,
            backgroundColor: "rgba(15, 15, 15, 0.95)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <SearchIcon sx={{ color: "white", mr: 1 }} />
            <TextField
              autoFocus
              fullWidth
              variant="standard"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{
                input: { color: "white" },
                "& .MuiInput-underline:before": {
                  borderBottomColor: "white",
                },
              }}
            />
            <IconButton
              onClick={() => setOpenSearch(false)}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          {results.length > 0 && (
            <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
              {results.map((song) => (
                <SearchList key={song._id} song={song} />
              ))}
            </Box>
          )}
        </Box>
      </Dialog>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            },
          },
        }}
        sx={{
          "& .MuiDrawer-paper": {
            zIndex: "2000",
            backgroundColor: "#030303",
            color: "white",
            width: "65%",
            margin: "0",
            transition: "background-color 0.3s ease, width 0.3s ease",
            borderRight: open ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
          },
        }}
      >
        <Divider />
        {/* Home button  */}
        <Box>
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                navigate("/");
                setOpen(false);
              }}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  <HomeIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                >
                  Home
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          {/* Explore button  */}
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                navigate("/explore");
                setOpen(false);
              }}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  <ExploreIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                >
                  Explore
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          {/* Library button  */}
          <List>
            <ListItem
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                if (user) {
                  navigate("/library");
                } else {
                  setDialogOpen(true);
                }
                setOpen(false);
              }}
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  <LibraryMusicIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                >
                  My Music
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider
            sx={[
              {
                bgcolor: "gray",
                width: "80%",
                marginLeft: "25px",
                marginTop: "20px",
                marginBottom: "20px",
              },
            ]}
          />
          {/* New playlist */}
          <List>
            <ListItem disablePadding sx={{ display: open ? "block" : "none" }}>
              <ListItemButton
                onClick={() => {
                  if (user) {
                    setOpenPlaylistForm(true);
                  } else {
                    setDialogOpen(true);
                  }
                  setOpen(false);
                }}
                sx={{
                  minHeight: 48,
                  backdropFilter: "blur(10px)",
                  borderRadius: "50px",
                  transition: "all 0.3s ease-in-out",
                  display: "flex",
                  alignItems: "center",
                  marginX: open ? "10px" : "0px",
                  paddingX: open ? 2.5 : 1,
                  justifyContent: open ? "flex-start" : "center",
                  backgroundColor: open
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                  "&:hover": open
                    ? {
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        transform: "scale(1.05)",
                      }
                    : {},
                }}
              >
                <IoAdd size={22} color="white" />
                {open && (
                  <ListItemText
                    primary="New Playlist"
                    sx={{
                      marginLeft: 1,
                      fontWeight: "bold",
                      letterSpacing: "0.5px",
                      color: "white",
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          </List>
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => {
                 if(user){
                  navigate("/likedSong");
                 }else{
                  setDialogOpen(true);
                 }
                  setOpen(false);
                }}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: "initial",
                      }
                    : {
                        justifyContent: "center",
                      },
                ]}
              >
                <ListItemText
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                >
                  <div className="grid gap-1">
                    <h1>Liked Songs</h1>
                    <p className="text-gray-300 flex items-center text-[13px]">
                      <PushPinIcon sx={{ color: "gray", fontSize: "20px" }} />
                      Auto Playlist
                    </p>
                  </div>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
          <List sx={{ height: "280px", overflowX: "auto" }}>
            {playlists.map((playlist) => (
              <ListItem
                key={playlist._id}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  onClick={() => {
                    navigate(`/playlist/${playlist._id}`);
                    setOpen(false);
                  }}
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    open
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemText
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  >
                    <div className="grid gap-1">
                      <h1>{playlist.name}</h1>

                      <p className="text-gray-300 flex items-center text-[13px]">
                        <AccountCircle
                          sx={{ color: "gray", fontSize: "20px" }}
                        />
                        {playlist.owner.firstName +
                          " " +
                          playlist.owner.lastName}
                      </p>
                    </div>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <AuthDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
      <UploadMusicDialog open={openFrom} onClose={() => setOpenFrom(false)} />
      <CreatePlaylist
        open={openPlaylistForm}
        handleClose={() => setOpenPlaylistForm(false)}
      />
    </div>
  );
}
