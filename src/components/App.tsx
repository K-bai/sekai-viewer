import {
  AppBar,
  Button,
  Container,
  createMuiTheme,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AspectRatio as AspectRatioIcon,
  Album as AlbumIcon,
  MoveToInbox as MoveToInboxIcon,
  ArrowBackIos as ArrowBackIosIcon,
  Settings as SettingsIcon,
  Brightness4,
  Brightness7,
  BrightnessAuto,
} from "@material-ui/icons";
import { Account, AccountGroup, CalendarText } from "mdi-material-ui";
import React, { forwardRef, useMemo, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Link,
  LinkProps,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

const drawerWidth = 240;
const CardList = lazy(() => import("./CardList"));
const HomeView = lazy(() => import("./Home"));
const MusicList = lazy(() => import("./MusicList"));
const GachaList = lazy(() => import("./GachaList"));
const EventList = lazy(() => import("./EventList"));
const GachaDetail = lazy(() => import("./GachaDetail"));
const CardDetail = lazy(() => import("./CardDetail"));
const MusicDetail = lazy(() => import("./MusicDetail"));
const EventDetail = lazy(() => import("./EventDetail"));

const useStyles = makeStyles((theme) => ({
  toolbar: {
    ...theme.mixins.toolbar,
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // justifyContent: 'flex-end'
  },
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

interface IListItemLinkProps {
  icon: React.ReactElement;
  text: string;
  to: string;
  disabled: boolean;
  theme?: Theme;
}

function ListItemLink(
  props: IListItemLinkProps
): React.ReactElement<IListItemLinkProps> {
  const { icon, text, to, theme } = props;
  const match = useRouteMatch({
    path: to,
    exact: to === "/",
  });
  // const theme = useTheme();

  const renderLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, LinkProps>((itemProps, ref) => (
        <Link to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li
      style={{
        width: "100%",
      }}
    >
      {/*
      // @ts-ignore */}
      <ListItem component={renderLink}>
        <ListItemIcon
          style={{
            color: match
              ? theme!.palette.secondary.main
              : theme!.palette.text.primary,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={text}
          style={{
            color: match
              ? theme!.palette.secondary.main
              : theme!.palette.text.primary,
          }}
        ></ListItemText>
      </ListItem>
    </li>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const leftBtns: IListItemLinkProps[] = [
    {
      text: t("common:home"),
      icon: <HomeIcon></HomeIcon>,
      to: "/",
      disabled: false,
    },
    {
      text: t("common:card"),
      icon: <AspectRatioIcon></AspectRatioIcon>,
      to: "/card",
      disabled: false,
    },
    {
      text: t("common:music"),
      icon: <AlbumIcon></AlbumIcon>,
      to: "/music",
      disabled: false,
    },
    {
      text: t("common:gacha"),
      icon: <MoveToInboxIcon></MoveToInboxIcon>,
      to: "/gacha",
      disabled: false,
    },
    {
      text: t("common:event"),
      icon: <CalendarText></CalendarText>,
      to: "/event",
      disabled: false,
    },
    {
      text: t("common:unit"),
      icon: <AccountGroup></AccountGroup>,
      to: "/unit",
      disabled: true,
    },
    {
      text: t("common:member"),
      icon: <Account></Account>,
      to: "/member",
      disabled: true,
    },
  ];
  // const theme = useTheme();
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [lang, setLang] = React.useState(i18n.language);

  const { goBack } = useHistory();

  const preferDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [displayMode, setDisplayMode] = React.useState<
    "dark" | "light" | "auto"
  >(
    (localStorage.getItem("display-mode") as
      | "dark"
      | "light"
      | "auto"
      | undefined) || "auto"
  );

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type:
            displayMode === "auto"
              ? preferDarkMode
                ? "dark"
                : "light"
              : displayMode,
        },
      }),
    [displayMode, preferDarkMode]
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar}>
        <Typography variant="h6">{t("common:toolbar.title")}</Typography>
      </div>
      <Divider></Divider>
      <List>
        {leftBtns.map((elem) => {
          return (
            <ListItem disabled={elem.disabled} button key={elem.to}>
              <ListItemLink
                to={elem.to}
                text={elem.text}
                icon={elem.icon}
                disabled={elem.disabled}
                theme={theme}
              ></ListItemLink>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap classes={{ root: classes.title }}>
              Sekai Viewer{" "}
              <Typography component="span" variant="body2">
                Open Beta
              </Typography>
            </Typography>
            <IconButton color="inherit" onClick={() => goBack()} disableRipple>
              <ArrowBackIosIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setIsSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <Container className={classes.content} maxWidth="md">
          <div className={classes.toolbar}></div>
          <Switch>
            <Suspense fallback={<div>Loading...</div>}>
              <Route path="/" exact>
                <HomeView />
              </Route>
              <Route path="/card" exact>
                <CardList />
              </Route>
              <Route path="/card/:cardId(\d+)">
                <CardDetail />
              </Route>
              <Route path="/music" exact>
                <MusicList />
              </Route>
              <Route path="/music/:musicId(\d+)">
                <MusicDetail />
              </Route>
              <Route path="/gacha" exact>
                <GachaList />
              </Route>
              <Route path="/gacha/:gachaId">
                <GachaDetail />
              </Route>
              <Route path="/event" exact>
                <EventList />
              </Route>
              <Route path="/event/:eventId">
                <EventDetail />
              </Route>
            </Suspense>
          </Switch>
        </Container>
        <Dialog open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
          <DialogTitle>{t("common:settings.title")}</DialogTitle>
          <DialogContent>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("common:language")}</FormLabel>
              <RadioGroup
                row
                aria-label="language"
                value={lang}
                onChange={(e, v) => {
                  setLang(v);
                  i18n.changeLanguage(v);
                }}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label="EN"
                ></FormControlLabel>
                <FormControlLabel
                  value="zh-CN"
                  control={<Radio />}
                  label="简"
                ></FormControlLabel>
                <FormControlLabel
                  value="zh-TW"
                  control={<Radio />}
                  label="繁"
                ></FormControlLabel>
                <FormControlLabel
                  value="jp"
                  control={<Radio />}
                  label="日"
                ></FormControlLabel>
                <FormControlLabel
                  value="ko"
                  control={<Radio />}
                  label="한"
                ></FormControlLabel>
                <FormControlLabel
                  value="es"
                  control={<Radio />}
                  label="Es"
                ></FormControlLabel>
                <FormControlLabel
                  value="de"
                  control={<Radio />}
                  label="De"
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t("common:darkmode")}</FormLabel>
              <RadioGroup
                row
                aria-label="dark mode"
                value={displayMode}
                onChange={(e, v) => {
                  setDisplayMode(v as "dark" | "light" | "auto");
                  localStorage.setItem("display-mode", v);
                }}
              >
                <FormControlLabel
                  value="dark"
                  control={<Radio />}
                  label={<Brightness4 />}
                ></FormControlLabel>
                <FormControlLabel
                  value="light"
                  control={<Radio />}
                  label={<Brightness7 />}
                ></FormControlLabel>
                <FormControlLabel
                  value="auto"
                  control={<Radio />}
                  label={<BrightnessAuto />}
                ></FormControlLabel>
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsSettingsOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}

export default App;
