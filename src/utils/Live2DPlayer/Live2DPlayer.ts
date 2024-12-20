import type { ILayerData, ILive2DCachedAsset } from "./types.d";
import { Texture } from "pixi.js";
import type { Application } from "pixi.js";

import { log } from "./log";

// layers
import BaseLayer from "./layer/BaseLayer";
import Background from "./layer/Background";
import Fullcolor from "./layer/Fullcolor";
import Dialog from "./layer/Dialog";
import Telop from "./layer/Telop";
import Flashback from "./layer/Flashback";
import SceneEffect from "./layer/SceneEffect";
import Live2D from "./layer/Live2D";

import AnimationController from "./animation/AnimationController";

export class Live2DPlayer {
  app: Application;
  private stage_size: [number, number];
  public animate: AnimationController;
  public layers: {
    background: Background;
    fullcolor: Fullcolor;
    dialog: Dialog;
    telop: Telop;
    flashback: Flashback;
    scene_effect: SceneEffect;
    live2d: Live2D;
  };

  constructor(
    app: Application,
    stage_size: [number, number],
    ui_assets: ILive2DCachedAsset[],
    screen_length = 2000
  ) {
    this.app = app;
    this.stage_size = stage_size;
    this.animate = new AnimationController();

    // create texture
    const textures = ui_assets.map((asset) => ({
      identifer: asset.identifer,
      texture: Texture.from(asset.data as HTMLImageElement),
    }));

    //initilize stage
    app.stage.removeChildren();
    const layer_data: ILayerData = {
      stage_size: this.stage_size,
      screen_length: screen_length,
      animation_controller: this.animate,
      textures: textures,
    };
    this.layers = {
      background: new Background(layer_data),
      fullcolor: new Fullcolor(layer_data),
      telop: new Telop(layer_data),
      flashback: new Flashback(layer_data),
      scene_effect: new SceneEffect(layer_data),
      dialog: new Dialog(layer_data),
      live2d: new Live2D(layer_data),
    };
    app.stage.addChild(this.layers.background.root);
    app.stage.addChild(this.layers.live2d.root);
    app.stage.addChild(this.layers.dialog.root);
    app.stage.addChild(this.layers.telop.root);
    app.stage.addChild(this.layers.scene_effect.root);
    app.stage.addChild(this.layers.flashback.root);
    app.stage.addChild(this.layers.fullcolor.root);
    log.log("Live2DPlayer", `player init.`);
  }

  set_stage_size = (stage_size: [number, number]) => {
    this.stage_size = stage_size;
    this.update_style();
  };

  update_style = () => {
    if (this.app.stage.children.length === 0) return;
    Object.values(this.layers).forEach((l) => l.set_style(this.stage_size));
  };

  show_layer = async (layer: BaseLayer, time: number) => {
    if (layer.root.alpha !== 1) {
      this.animate.progress_wrapper((progress) => {
        layer.root.alpha = progress;
      }, time);
    }
  };

  hide_layer = async (layer: BaseLayer, time: number) => {
    if (layer.root.alpha !== 0) {
      this.animate.progress_wrapper((progress) => {
        layer.root.alpha = 1 - progress;
      }, time);
    }
  };

  destroy = () => {
    Object.values(this.layers).forEach((l) => l.destroy());
  };
}
