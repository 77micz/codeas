


/**
 * 存储项目用到的所有常量
 */


// ======================= 导入 =======================
import { readFileSync } from 'fs'
import { URL } from 'url'







// ======================= 常量 =======================
// 读取package.json中的version字段
export const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')).version




