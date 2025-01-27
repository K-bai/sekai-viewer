import { Grid, Typography, TypographyProps } from "@mui/material";
import { StringMap, TOptions } from "i18next";
import React, { useEffect, useState } from "react";
import { useRootStore } from "../../stores/root";
import { IGameChara, IReleaseCondition } from "../../types.d";
import { useCachedData } from "../../utils";
import { useAssetI18n } from "../../utils/i18n";

export const ContentTrans: React.FC<{
  contentKey: string;
  original: string;
  originalProps?: TypographyProps;
  translatedProps?: TypographyProps;
  assetTOptions?: string | TOptions<StringMap>;
}> = ({
  contentKey,
  original,
  originalProps,
  translatedProps,
  assetTOptions,
}) => {
  const {
    settings: { contentTransMode },
  } = useRootStore();
  const { assetT } = useAssetI18n();

  switch (contentTransMode) {
    case "original":
      return <Typography {...originalProps}>{original}</Typography>;
    case "translated":
      return (
        <Typography {...translatedProps} color="textPrimary">
          {assetT(contentKey, original, assetTOptions)}
        </Typography>
      );
    case "both":
      return (
        <Grid container direction="column">
          <Typography {...originalProps} color="textPrimary">
            {original}
          </Typography>
          <Typography {...translatedProps} color="textSecondary">
            {assetT(contentKey, original, assetTOptions)}
          </Typography>
        </Grid>
      );
  }
};

export const ContentListTrans: React.FC<{
  content: {
    contentKey: string;
    original: string;
  }[];
  format: (content: string[]) => string;
  originalProps?: TypographyProps;
  translatedProps?: TypographyProps;
  assetTOptions?: string | TOptions<StringMap>;
}> = ({ content, format, originalProps, translatedProps, assetTOptions }) => {
  const {
    settings: { contentTransMode },
  } = useRootStore();
  const { assetT } = useAssetI18n();

  switch (contentTransMode) {
    case "original":
      return (
        <Typography {...originalProps}>
          {format(content.map((c) => c.original))}
        </Typography>
      );
    case "translated":
      return (
        <Typography {...translatedProps} color="textPrimary">
          {format(
            content.map((c) => assetT(c.contentKey, c.original, assetTOptions))
          )}
        </Typography>
      );
    case "both":
      return (
        <Grid container direction="column">
          <Typography {...originalProps} color="textPrimary">
            {format(content.map((c) => c.original))}
          </Typography>
          <Typography {...translatedProps} color="textSecondary">
            {format(
              content.map((c) =>
                assetT(c.contentKey, c.original, assetTOptions)
              )
            )}
          </Typography>
        </Grid>
      );
  }
};

export const CharaNameTrans: React.FC<{
  characterId: number;
  originalProps?: TypographyProps;
  translatedProps?: TypographyProps;
  assetTOptions?: string | TOptions<StringMap>;
}> = ({ characterId, originalProps, translatedProps, assetTOptions }) => {
  const {
    settings: { contentTransMode },
  } = useRootStore();

  const [charas] = useCachedData<IGameChara>("gameCharacters");
  const { assetT, assetI18n } = useAssetI18n();

  const [chara, setChara] = useState<IGameChara>();

  useEffect(() => {
    if (charas) {
      setChara(charas.find((c) => c.id === characterId));
    }
  }, [charas, characterId]);

  if (chara) {
    switch (contentTransMode) {
      case "original":
        return (
          <Typography {...originalProps} color="textPrimary">
            {chara.firstName} {chara.givenName}
          </Typography>
        );
      case "translated":
        return ["zh-CN", "zh-TW", "ko", "ja"].includes(assetI18n.language) ? (
          <Typography {...translatedProps} color="textPrimary">
            {chara.firstName
              ? assetT(
                  `character_name:${characterId}.firstName`,
                  chara.firstName,
                  assetTOptions
                )
              : ""}{" "}
            {assetT(
              `character_name:${characterId}.givenName`,
              chara.givenName,
              assetTOptions
            )}
          </Typography>
        ) : (
          <Typography {...translatedProps} color="textPrimary">
            {assetT(
              `character_name:${characterId}.givenName`,
              chara.givenName,
              assetTOptions
            )}{" "}
            {chara.firstName
              ? assetT(
                  `character_name:${characterId}.firstName`,
                  chara.firstName,
                  assetTOptions
                )
              : ""}
          </Typography>
        );
      case "both":
        return (
          <Grid container direction="column">
            <Typography {...originalProps}>
              {chara.firstName} {chara.givenName}
            </Typography>
            {["zh-CN", "zh-TW", "ko", "ja"].includes(assetI18n.language) ? (
              <Typography color="textSecondary" {...translatedProps}>
                {chara.firstName
                  ? assetT(
                      `character_name:${characterId}.firstName`,
                      chara.firstName,
                      assetTOptions
                    )
                  : ""}{" "}
                {assetT(
                  `character_name:${characterId}.givenName`,
                  chara.givenName,
                  assetTOptions
                )}
              </Typography>
            ) : (
              <Typography color="textSecondary" {...translatedProps}>
                {assetT(
                  `character_name:${characterId}.givenName`,
                  chara.givenName,
                  assetTOptions
                )}{" "}
                {chara.firstName
                  ? assetT(
                      `character_name:${characterId}.firstName`,
                      chara.firstName,
                      assetTOptions
                    )
                  : ""}
              </Typography>
            )}
          </Grid>
        );
    }
  } else {
    return <Typography></Typography>;
  }
};

export const ReleaseCondTrans: React.FC<{
  releaseCondId: number;
  originalProps?: TypographyProps;
  translatedProps?: TypographyProps;
  assetTOptions?: string | TOptions<StringMap>;
}> = ({ releaseCondId, originalProps, translatedProps, assetTOptions }) => {
  const [releaseConds] = useCachedData<IReleaseCondition>("releaseConditions");

  const [releaseCond, setReleaseCond] = useState<IReleaseCondition>();

  useEffect(() => {
    if (releaseConds) {
      setReleaseCond(releaseConds.find((rc) => rc.id === releaseCondId));
    }
  }, [releaseCondId, releaseConds]);

  if (releaseCond) {
    let i18nKey = "";
    switch (releaseCond.releaseConditionType) {
      case "none":
        i18nKey = `release_cond:none_${releaseCond.id}`;
        break;
      case "card_level":
        i18nKey = `release_cond:card_level`;
        assetTOptions = Object.assign({}, assetTOptions, {
          level: releaseCond.releaseConditionTypeLevel,
        });
        break;
      case "unit_rank":
        i18nKey = `release_cond:unit_rank_${releaseCond.releaseConditionTypeId}`;
        assetTOptions = Object.assign({}, assetTOptions, {
          rank: releaseCond.releaseConditionTypeLevel,
        });
        break;
      case "event_point":
        i18nKey = `release_cond:event_point`;
        assetTOptions = Object.assign({}, assetTOptions, {
          point: releaseCond.releaseConditionTypeQuantity,
        });
        break;
      default:
        i18nKey = `release_cond:${releaseCond.releaseConditionType}`;
        break;
    }
    return (
      <ContentTrans
        contentKey={i18nKey}
        original={releaseCond.sentence}
        originalProps={originalProps}
        translatedProps={translatedProps}
        assetTOptions={assetTOptions}
      />
    );
  } else {
    return <div></div>;
  }
};
