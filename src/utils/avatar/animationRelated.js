// 從Avatar模型提取，當裏面animation發生内容修改時，留意這個map
const actionMap = new Map([
  ['Walk', 0],
  ['T_pose', 1],
  ['Standing_up', 2],
  ['Sitting_down', 3],
  ['Run', 4],
  ['Jump', 5],
  ['Idle', 6],
  ['Dance', 7],
  ['Clapping', 8],
]);

// actionInit
function name(params) {}

export { actionMap };
