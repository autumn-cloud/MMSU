import cbeaShirt from "../assets/23cde09fe6d5d17aa7a66171a0f85d9c9b765249.png";
import coeShirt from "../assets/7e2430f5830668b6971707f76a70211cd435640d.png";
import peUniform from "../assets/3def84d7268eb07d365a01c84e8822a17bbf49c4.png";
import nursingUniform from "../assets/4233f3c468dd9de0a45720db2a3e0e4c6644765e.png";
import ccisUniform from "../assets/89820c77dc85eb64eafcda514819c1aad4d2f2fa.png";
import mmsuIdLace from "../assets/496328913_2112295392580894_4583253455759426295_n.jpg";
import cteUniformGirls from "../assets/Screenshot 2025-10-31 214013.png";
import cteUniformBoys from "../assets/Screenshot 2025-10-31 214029.png";
import casUniform from "../assets/548889699_1473137967055410_5019683523204594101_n.jpg";
import citGalaUniform from "../assets/541223683_649868378157152_2810788496719529391_n.jpg";
import citRedPolo from "../assets/554035109_1358485339178997_847930954984113576_n.jpg";
import cafsdUniform from "../assets/541291088_736995792498254_9200391229557665470_n.jpg";

export const assetMap: Record<string, string> = {
  "/assets/7e2430f5830668b6971707f76a70211cd435640d.png": coeShirt,
  "/assets/23cde09fe6d5d17aa7a66171a0f85d9c9b765249.png": cbeaShirt,
  "/assets/3def84d7268eb07d365a01c84e8822a17bbf49c4.png": peUniform,
  "/assets/4233f3c468dd9de0a45720db2a3e0e4c6644765e.png": nursingUniform,
  "/assets/89820c77dc85eb64eafcda514819c1aad4d2f2fa.png": ccisUniform,
  "/assets/496328913_2112295392580894_4583253455759426295_n.jpg": mmsuIdLace,
  "/assets/Screenshot 2025-10-31 214013.png": cteUniformGirls,
  "/assets/Screenshot 2025-10-31 214029.png": cteUniformBoys,
  "/assets/548889699_1473137967055410_5019683523204594101_n.jpg": casUniform,
  "/assets/541223683_649868378157152_2810788496719529391_n.jpg": citGalaUniform,
  "/assets/554035109_1358485339178997_847930954984113576_n.jpg": citRedPolo,
  "/assets/541291088_736995792498254_9200391229557665470_n.jpg": cafsdUniform,
};

export function resolveProductImage(path?: string | null): string {
  if (!path) return "";
  if (assetMap[path]) return assetMap[path];
  return path;
}

