import type { Live2DController } from "../../Live2DController";
import type { Snippet } from "../../../../types.d";
import { log } from "../../log";

export default async function StopShakeScreen(
  controller: Live2DController,
  action: Snippet
) {
  const action_detail =
    controller.scenarioData.SpecialEffectData[action.ReferenceIndex];
  log.log(
    "Live2DController",
    "SpecialEffect/StopShakeScreen",
    action,
    action_detail
  );
  controller.layers.background.stop_shake();
  controller.layers.live2d.stop_shake();
}
