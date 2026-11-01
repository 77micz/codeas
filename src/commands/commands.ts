


/**
 * 所有命令的函数
 */


// ======================= 导入 =======================
// 导入readFileSync模块，用于读取文件内容
import { readFileSync } from 'node:fs'






// ======================= 全局变量 =======================
// 读取package.json中的version字段
export const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')).version







// ======================= 函数 =======================
/**
 * 版本命令函数
 * @param string[] options 命令行参数数组
 * @returns string 版本号
 */
export function version(...options: string[]) {
    // 判断参数是否为空
    if (options.length != 0) {
        // 把每个参数包裹上单引号
        options = options.map(opt => `'${opt}'`)
        throw new Error(`Options error: unknow option ${options.join(' ')}
        Please use "codeas version" to show version.
        `)
    }
    return `codeas version ${VERSION}\n`
}


