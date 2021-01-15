import {
  Typography,
  Container,
  Grid,
  ButtonGroup,
  Button,
} from "@material-ui/core";
import { useLayoutStyles } from "../../styles/layout";
import React, { Fragment, useEffect, useState, useCallback } from "react";
import { IEventInfo } from "../../types";
import { useCachedData } from "../../utils";
import InfiniteScroll from "../subs/InfiniteScroll";

import { useTranslation } from "react-i18next";
import GridView from "./GridView";
import {
  GetApp,
  GetAppOutlined,
  Publish,
  PublishOutlined,
  Update,
} from "@material-ui/icons";

type ViewGridType = "grid" | "agenda" | "comfy";

function getPaginatedEvents(events: IEventInfo[], page: number, limit: number) {
  return events.slice(limit * (page - 1), limit * page);
}

const ListCard: { [key: string]: React.FC<{ data?: IEventInfo }> } = {
  grid: GridView,
};

const EventList: React.FC<{}> = () => {
  const layoutClasses = useLayoutStyles();
  const { t } = useTranslation();

  const [eventsCache] = useCachedData<IEventInfo>("events");
  const [events, setEvents] = useState<IEventInfo[]>([]);

  const [viewGridType] = useState<ViewGridType>(
    (localStorage.getItem("event-list-grid-view-type") ||
      "grid") as ViewGridType
  );
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [lastQueryFin, setLastQueryFin] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [updateSort, setUpdateSort] = useState<"asc" | "desc">(
    (localStorage.getItem("event-list-update-sort") || "desc") as "desc"
  );
  const [sortedCache, setSortedCache] = useState<IEventInfo[]>([]);

  useEffect(() => {
    document.title = t("title:eventList");
  }, [t]);

  useEffect(() => {
    setEvents((events) => [
      ...events,
      ...getPaginatedEvents(sortedCache, page, limit),
    ]);
    setLastQueryFin(true);
  }, [page, limit, setLastQueryFin, sortedCache]);

  useEffect(() => {
    if (!eventsCache || !eventsCache.length) return;
    let sortedCache = [...eventsCache];
    if (updateSort === "desc") {
      sortedCache = sortedCache.sort((a, b) => b.startAt - a.startAt);
    } else if (updateSort === "asc") {
      sortedCache = sortedCache.sort((a, b) => a.startAt - b.startAt);
    }
    setSortedCache(sortedCache);
    setEvents([]);
    setPage(0);
  }, [updateSort, eventsCache, setPage]);

  useEffect(() => {
    setIsReady(Boolean(eventsCache && eventsCache.length));
  }, [setIsReady, eventsCache]);

  const callback = useCallback(
    (
      entries: readonly IntersectionObserverEntry[],
      setHasMore: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      if (!isReady) return;
      if (
        entries[0].isIntersecting &&
        lastQueryFin &&
        (!sortedCache.length || sortedCache.length > page * limit)
      ) {
        setPage((page) => page + 1);
        setLastQueryFin(false);
      } else if (sortedCache.length && sortedCache.length <= page * limit) {
        setHasMore(false);
      }
    },
    [isReady, lastQueryFin, limit, page, sortedCache.length]
  );

  const handleUpdateSort = useCallback((sort: "asc" | "desc") => {
    setUpdateSort(sort);
    localStorage.setItem("event-list-update-sort", sort);
  }, []);

  return (
    <Fragment>
      <Typography variant="h6" className={layoutClasses.header}>
        {t("common:event")}
      </Typography>
      <Container className={layoutClasses.content}>
        <Grid container justify="space-between">
          <ButtonGroup color="primary" style={{ marginBottom: "1%" }}>
            <Button size="medium" onClick={() => handleUpdateSort("asc")}>
              <Update />
              {updateSort === "asc" ? <Publish /> : <PublishOutlined />}
            </Button>
            <Button size="medium" onClick={() => handleUpdateSort("desc")}>
              <Update />
              {updateSort === "desc" ? <GetApp /> : <GetAppOutlined />}
            </Button>
          </ButtonGroup>
        </Grid>
        <InfiniteScroll<IEventInfo>
          ViewComponent={ListCard[viewGridType]}
          callback={callback}
          data={events}
          gridSize={
            ({
              grid: {
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              },
              agenda: {
                xs: 12,
              },
              comfy: {
                xs: 12,
              },
            } as const)[viewGridType]
          }
        />
      </Container>
    </Fragment>
  );
};

export default EventList;
