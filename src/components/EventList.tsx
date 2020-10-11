import {
  Card,
  CardHeader,
  CardMedia,
  makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { Fragment, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { IEventInfo } from "../types";
import { useCachedData, useRefState } from "../utils";

import InfiniteScroll from "./subs/InfiniteScroll";

const useStyles = makeStyles((theme) => ({
  media: {
    paddingTop: "56.25%",
    backgroundSize: "contain",
  },
  card: {
    // margin: theme.spacing(0.5),
    cursor: "pointer",
  },
  header: {
    "white-space": "nowrap",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    [theme.breakpoints.down("md")]: {
      "max-width": "200px",
    },
    "max-width": "250px",
  },
  "grid-out": {
    padding: theme.spacing("1%", "2%"),
  },
}));

function getPaginitedEvents(events: IEventInfo[], page: number, limit: number) {
  return events.slice(limit * (page - 1), limit * page);
}

const EventList: React.FC<{}> = () => {
  const classes = useStyles();
  const { push } = useHistory();
  const { path } = useRouteMatch();

  const [events, setEvents] = useState<IEventInfo[]>([]);
  const [eventsCache, eventsCacheRef] = useCachedData<IEventInfo>("events");

  const [viewGridType] = useState<string>(
    localStorage.getItem("event-list-grid-view-type") || "grid"
  );
  const [page, pageRef, setPage] = useRefState<number>(1);
  const [limit, limitRef] = useRefState<number>(12);
  const [, lastQueryFinRef, setLastQueryFin] = useRefState<boolean>(true);
  const [, isReadyRef, setIsReady] = useRefState<boolean>(false);

  useEffect(() => {
    document.title = "Event List | Sekai Viewer";
  }, []);

  useEffect(() => {
    setEvents((events) => [
      ...events,
      ...getPaginitedEvents(eventsCache, page, limit),
    ]);
    setLastQueryFin(true);
  }, [page, limit, setLastQueryFin, eventsCache]);

  useEffect(() => {
    setIsReady(Boolean(eventsCache.length));
  }, [setIsReady, eventsCache]);

  const callback = (
    entries: IntersectionObserverEntry[],
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (!isReadyRef.current) return;
    if (
      entries[0].isIntersecting &&
      lastQueryFinRef.current &&
      (!eventsCacheRef.current.length ||
        eventsCacheRef.current.length > pageRef.current * limitRef.current)
    ) {
      setPage((page) => page + 1);
      setLastQueryFin(false);
    } else if (
      eventsCacheRef.current.length &&
      eventsCacheRef.current.length <= pageRef.current * limitRef.current
    ) {
      setHasMore(false);
    }
  };

  const ListCard: { [key: string]: React.FC<{ data: IEventInfo }> } = {
    grid: ({ data }) => {
      return (
        <Card
          className={classes.card}
          onClick={() => push(path + "/" + data.id)}
        >
          <CardHeader
            title={data.name}
            titleTypographyProps={{
              variant: "subtitle1",
              classes: {
                root: classes.header,
              },
            }}
            subheader={data.eventType}
          ></CardHeader>
          <CardMedia
            className={classes.media}
            image={`https://sekai-res.dnaroma.eu/file/sekai-assets/event/${data.assetbundleName}/logo_rip/logo.webp`}
            title={data.name}
          ></CardMedia>
        </Card>
      );
    },
  };

  const ListLoading: React.FC<any> = () => {
    return (
      <Card className={classes.card}>
        <CardHeader
          title={<Skeleton variant="text" width="50%"></Skeleton>}
          subheader={<Skeleton variant="text" width="80%"></Skeleton>}
        ></CardHeader>
        <Skeleton variant="rect" height={130}></Skeleton>
      </Card>
    );
  };

  return (
    <Fragment>
      {InfiniteScroll<IEventInfo>({
        viewComponent: ListCard[viewGridType],
        loadingComponent: ListLoading,
        callback,
        data: events,
        gridSize: {
          xs: 12,
          md: viewGridType === "grid" ? 4 : viewGridType === "agenda" ? 12 : 12,
        },
      })}
    </Fragment>
  );
};

export default EventList;
