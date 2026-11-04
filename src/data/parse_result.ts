

/**
 * 命令行参数解析结果数据结构
 */


// ======================= 全局变量 =======================


export interface ParseResult {
    options: Record<string, Array<string | number>>
    subArgs: Array<string | number>
}







