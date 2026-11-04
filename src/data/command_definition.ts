



/**
 * 定义命令结构
 */




// ======================= 全局变量 =======================



// 定义选项结构
interface OptionDefinition {
    // 选项名称
    name: string
    // 选项描述
    description: string
    // 选项需要的参数数量
    paramNum: number
    // 选项参数类型
    type: string | number
}




// 定义参数结构
interface ArgDefinition {
    // 参数名称
    name: string
    // 参数描述
    description: string
    // 参数值类型
    type: string | number
    // 参数是否必填
    required: boolean
}






// 定义命令结构
export interface CommandDefinition {
    name: string
    description: string
    options: Record<string, OptionDefinition>
    args: Array<ArgDefinition>
}












