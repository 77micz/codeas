


/**
 * 存储项目用到的所有常量
 */


// ======================= 导入 =======================
import { readFileSync } from 'fs'
import { URL } from 'url'
// 导入命令参数解析结果类型
import type { ParseResult } from '../interface/parse_result.js'







// ======================= 常量 =======================
// 读取package.json中的version字段
export const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')).version






// 只在帮助信息调用时使用的常量
export const CallHelp: ParseResult = {
    options: {
        '--help': [],
    },
    subArgs: [],
}



