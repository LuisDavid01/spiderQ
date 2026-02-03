import { z } from 'zod'

/**
 * Definición estándar de herramientas compatible con ambos providers
 */
export interface ToolDefinition {
  name: string
  description: string
  parameters: z.ZodObject
  execute?: (args: any) => Promise<any>
}

/**
 * Convierte herramientas Zod a JSON Schema nativo usando Zod v4
 * Funciona tanto con OpenAI como con OpenRouter sin dependencias externas
 */
export const formatToolsForProvider = (tools: ToolDefinition[], provider: 'openai' | 'openrouter') => {
  const formattedTools = tools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: z.toJSONSchema(tool.parameters, {
      })
    }
  }))

  // OpenAI espera tools[] directamente, OpenRouter también es compatible
  return formattedTools
}

/**
 * Valida que un tool definition sea compatible con ambos providers
 */
export const validateTool = (tool: ToolDefinition): boolean => {
  try {
    z.toJSONSchema(tool.parameters, {
    })
    return true
  } catch (error) {
    console.error(`Tool validation failed for ${tool.name}:`, error)
    return false
  }
}

/**
 * Extrae tipos de un Zod schema para type safety
 */
export type InferToolInput<T extends z.ZodObject> = z.infer<T>

/**
 * Crea un wrapper type-safe para tool definitions
 */
export const createTool = <T extends z.ZodObject>(
  name: string,
  description: string,
  parameters: T,
  execute?: (args: z.infer<T>) => Promise<any>
): ToolDefinition => ({
  name,
  description,
  parameters,
  execute
})
