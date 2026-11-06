



/**
 * 帮助信息字典
 */

// ======================= 导入帮助函数 =======================
import { statHelps, treeHelps } from '../commands/helps.js';


// ======================= 帮助信息字典 =======================
export const helpsDict: Record<string, (() => string)> = {
    "stat": statHelps,
    "tree": treeHelps,
}







