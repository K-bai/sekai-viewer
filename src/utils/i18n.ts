// import { ContentTransModeType } from "./../types.d";
import i18n, { TOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import fetchBackend from "i18next-fetch-backend";
import detector from "i18next-browser-languagedetector";
import { useCallback } from "react";
import { useCachedData } from ".";
import { ContentTransModeType, IGameChara } from "../types";
import { useRootStore } from "../stores/root";

export const assetI18n: typeof i18n = i18n.createInstance();
// export const announcementI18n: typeof i18n = i18n.createInstance();

export async function initGlobalI18n() {
  i18n
    .use(initReactI18next)
    .use(fetchBackend)
    .use(detector)
    .init({
      backend: {
        loadPath: import.meta.env.VITE_JSON_DOMAIN_WW + "/{{lng}}/{{ns}}.json",
      },
      defaultNS: "common",
      fallbackLng: {
        default: ["en"],
      },
      fallbackNS: "common",
      load: "currentOnly",
      ns: [
        "common",
        "home",
        "card",
        "music",
        "gacha",
        "event",
        "unit",
        "member",
        "filter",
        "music",
        "title",
        "member",
        "unit",
        "about",
        "support",
        "music_recommend",
        "story_reader",
        "story_reader_live2d",
        "mission",
        "event_calc",
        "team_build",
        "user",
        "auth",
        "announcement",
        "comment",
        "live2d",
        "virtual_live",
        "translate",
        "honor",
        "asset_viewer",
      ],
      returnEmptyString: false,
    });

  assetI18n
    .use(fetchBackend)
    .use(detector)
    .init({
      backend: {
        loadPath: import.meta.env.VITE_JSON_DOMAIN_WW + "/{{lng}}/{{ns}}.json",
      },
      fallbackLng: {
        default: ["ja"],
      },
      load: "currentOnly",
      ns: [
        "music_titles",
        "card_prefix",
        "card_skill_name",
        "event_name",
        "gacha_name",
        "character_name",
        "skill_desc",
        "character_profile",
        "unit_profile",
        "stamp_name",
        "comic_title",
        "release_cond",
        "card_episode_title",
        "music_vocal",
        "unit_story_chapter_title",
        "honor_mission",
        "normal_mission",
        "beginner_mission",
        "honor_name",
        "honorGroup_name",
        "virtualLive_name",
        "unit_story_episode_title",
        "event_story_episode_title",
        "character_mission",
        "card_gacha_phrase",
        "cheerful_carnival_teams",
        "cheerful_carnival_themes",
        "area_name",
      ],
      returnEmptyString: false,
    });

  // announcementI18n
  //   .use(fetchBackend)
  //   .use(detector)
  //   .init({
  //     supportedLngs: codes,
  //     fallbackLng: {
  //       default: ["en"],
  //       pt: ["pt-BR", "en"],
  //     },
  //     backend: {
  //       loadPath:
  //         import.meta.env.VITE_STRAPI_BASE +
  //         "/announcement/{{ns}}/translation/{{lng}}",
  //     },
  //     returnEmptyString: false,
  //   });
}

export function useAssetI18n() {
  const {
    settings: { contentTransMode },
  } = useRootStore();
  const assetT = useCallback(
    (key: string, original: string, options?: string | TOptions): string => {
      const translated = assetI18n.t(key, options);
      return translated === key.split(":")[1] ? original : translated;
    },
    []
  );
  const getTranslated = useCallback(
    (key: string, original: string, options?: string | TOptions) => {
      switch (contentTransMode) {
        case "original":
          return original;
        case "translated":
          return assetT(key, original, options);
        case "both":
          return `${original} | ${assetT(key, original, options)}`;
      }
    },
    [assetT, contentTransMode]
  );
  return { assetI18n, assetT, getTranslated };
}

export function useCharaName(forceTransMode?: ContentTransModeType) {
  let {
    settings: { contentTransMode },
  } = useRootStore();
  if (forceTransMode) contentTransMode = forceTransMode;
  const [charas] = useCachedData<IGameChara>("gameCharacters");
  const { assetT, assetI18n } = useAssetI18n();

  return useCallback(
    (charaId: number): string | undefined => {
      if (!charas || !charas.length) return;
      const chara = charas.find((chara) => chara.id === charaId);
      const jpOrderCodes = ["zh-CN", "zh-TW", "ko", "ja", "id", "ms"];
      if (chara?.firstName) {
        switch (contentTransMode) {
          case "original":
            return `${chara.firstName} ${chara.givenName}`;
          case "translated":
            return jpOrderCodes.includes(assetI18n.language)
              ? `${assetT(
                  `character_name:${charaId}.firstName`,
                  chara.firstName
                )} ${assetT(
                  `character_name:${charaId}.givenName`,
                  chara.givenName
                )}`
              : `${assetT(
                  `character_name:${charaId}.givenName`,
                  chara.givenName
                )} ${assetT(
                  `character_name:${charaId}.firstName`,
                  chara.firstName
                )}`;
          case "both":
            return (
              `${chara.firstName} ${chara.givenName} | ` +
              (jpOrderCodes.includes(assetI18n.language)
                ? `${assetT(
                    `character_name:${charaId}.firstName`,
                    chara.firstName
                  )} ${assetT(
                    `character_name:${charaId}.givenName`,
                    chara.givenName
                  )}`
                : `${assetT(
                    `character_name:${charaId}.givenName`,
                    chara.givenName
                  )} ${assetT(
                    `character_name:${charaId}.firstName`,
                    chara.firstName
                  )}`)
            );
        }
      }
      return chara?.givenName;
    },
    [assetI18n.language, assetT, charas, contentTransMode]
  );
}

// export function useAnnouncementI18n() {
//   return {
//     t: announcementI18n.t,
//     i18n: announcementI18n,
//     loadNS: announcementI18n.loadNamespaces,
//   };
// }
