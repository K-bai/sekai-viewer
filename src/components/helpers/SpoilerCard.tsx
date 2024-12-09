import { Box, Card, CardProps } from "@mui/material";
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import SpoilerTag from "../widgets/SpoilerTag";
import { useHistory } from "react-router-dom";
import { useIsTouchDevice } from "../../utils";

const SpoilerCard: React.FC<
  PropsWithChildren<{
    releaseTime: Date;
    toPath?: string;
  }> &
    CardProps
> = ({ children, releaseTime, toPath, ...props }) => {
  const history = useHistory();
  const isTouchDevice = useIsTouchDevice();

  const [isSpoiler, setIsSpoiler] = useState(false);
  const [touchTimes, setTouchTimes] = useState(0);

  useEffect(() => {
    setIsSpoiler(new Date() < releaseTime);

    return () => {
      setIsSpoiler(false);
    };
  }, [releaseTime]);

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> =
    useCallback(() => {
      setTouchTimes((prev) => prev + 1);
    }, []);

  const onCardClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      if (isSpoiler && isTouchDevice && touchTimes < 2) {
        return;
      }

      if (toPath) {
        history.push(toPath);
      }
    }, [history, isSpoiler, isTouchDevice, toPath, touchTimes]);

  return (
    <Card
      sx={{ cursor: "pointer", position: "relative" }}
      onClick={onCardClick}
      {...props}
    >
      {children}
      {isSpoiler && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            transition: "opacity .3s ease",
            zIndex: 1,
            opacity: 1,
            "&:hover": {
              opacity: 0,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onTouchEnd={onTouchEnd}
        >
          <Box>
            <SpoilerTag />
          </Box>
        </Box>
      )}
    </Card>
  );
};

export default SpoilerCard;
