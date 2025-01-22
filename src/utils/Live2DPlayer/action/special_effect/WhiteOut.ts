import type { Live2DController } from "../../Live2DController";
import type { Snippet } from "../../../../types.d";
import { log } from "../../log";

export default async function WhiteOut(
  controller: Live2DController,
  action: Snippet
) {
  const action_detail =
    controller.scenarioData.SpecialEffectData[action.ReferenceIndex];
  log.log("Live2DController", "SpecialEffect/WhiteOut", action, action_detail);
  controller.layers.dialog.hide(100);
  controller.layers.fullcolor.draw(0xffffff);
  await controller.layers.fullcolor.show(action_detail.Duration * 1000, true);
}
