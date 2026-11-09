


/**
 * 
 * 提供所有命令的数据结构给解析器使用
 * 
 */

// ======================= 导入 =======================
// 导入命令定义
import type { CommandDefinition } from '../interface/command_definition.js'



// ======================= 全局变量 =======================

// 所有命令定义



// 帮助命令定义
export const help: CommandDefinition = {
    name: '--help',
    description: '显示帮助信息',
    options: {
    },
    args: [
    ]
}


// 版本命令定义
export const version: CommandDefinition = {
    name: '--version',
    description: '显示版本号',
    options: {
    },
    args: [
    ]
}





// 统计命令定义
export const stat: CommandDefinition = {
    name: 'stat',
    description: '递归统计指定目录下不同文件类型数量',
    options: {
        "--help": {
            name: "--help",
            description: "显示帮助信息",
            paramNum: 0,
            type: "string"
        },
        "--auto": {
            name: "--auto",
            description: "自动忽略.gitignore中包含的文件/目录",
            paramNum: 0,
            type: "boolean"
        },
    },
    args: [
        {
            name: "directory",
            description: "目标目录，可以是相对路径或绝对路径",
            type: "string",
            required: true,
        }
    ]
}






// 目录结构命令定义
export const tree: CommandDefinition = {
    name: 'tree',
    description: '递归显示指定目录下的文件结构',
    options: {
        "--help": {
            name: "--help",
            description: "显示帮助信息",
            paramNum: 0,
            type: "string"
        },
        "--auto": {
            name: "--auto",
            description: "自动忽略.gitignore中包含的文件/目录",
            paramNum: 0,
            type: "boolean"
        },
        "--depth": {
            name: "--depth",
            description: "指定递归深度，默认值为2",
            paramNum: 1,
            type: "number"
        },
    },
    args: [
        {
            name: "directory",
            description: "目标目录，可以是相对路径或绝对路径",
            type: "string",
            required: true,
        }
    ]
}





















