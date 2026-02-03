import { describe, test, expect } from 'vitest'
import { z } from 'zod'
import { formatToolsForProvider, type ToolDefinition } from '../utils/toolSchema'

describe('Tool Schema Core Functionality', () => {
  test('formatToolsForProvider - tool básico', () => {
    const simpleTool: ToolDefinition = {
      name: 'test_simple',
      description: 'Simple test tool',
      parameters: z.object({
        message: z.string().describe('Simple message')
      })
    }

    const result = formatToolsForProvider([simpleTool], 'openrouter')
    
    // Verificar estructura básica
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('function')
    expect(result[0].function.name).toBe('test_simple')
    expect(result[0].function.description).toBe('Simple test tool')
    
    // Verificar que es un JSON Schema válido (sin validar estructura exacta)
    const jsonSchema = result[0].function.parameters
    expect(jsonSchema.type).toBe('object')
    expect(jsonSchema.required).toContain('message')
  })

  test('formatToolsForProvider - compatibilidad entre providers', () => {
    const simpleTool: ToolDefinition = {
      name: 'test_compatibility',
      description: 'Tool for provider compatibility testing',
      parameters: z.object({
        query: z.string()
      })
    }

    // Ambos providers deberían producir el mismo formato básico
    const openaiResult = formatToolsForProvider([simpleTool], 'openai')
    const openrouterResult = formatToolsForProvider([simpleTool], 'openrouter')
    
    // Verificar que ambos tengan la misma estructura básica
    expect(openaiResult[0].type).toBe(openrouterResult[0].type)
    expect(openaiResult[0].function.name).toBe(openrouterResult[0].function.name)
    expect(openaiResult[0].function.description).toBe(openrouterResult[0].function.description)
  })

  test('Zod v4 toJSONSchema - conversión correcta', () => {
    const stringSchema = z.string().describe('A simple string')
    const numberSchema = z.number().describe('A simple number')
    const booleanSchema = z.boolean().describe('A simple boolean')
    
    // Probar conversión individual
    expect(z.toJSONSchema(stringSchema)).toMatchObject({
      type: 'string',
      description: 'A simple string'
    })
    
    expect(z.toJSONSchema(numberSchema)).toMatchObject({
      type: 'number',
      description: 'A simple number'
    })
    
    expect(z.toJSONSchema(booleanSchema)).toMatchObject({
      type: 'boolean',
      description: 'A simple boolean'
    })
  })

  test('Manejo de tipos complejos anidados', () => {
    const complexTool: ToolDefinition = {
      name: 'complex_nested',
      description: 'Complex tool with nested objects',
      parameters: z.object({
        user: z.object({
          profile: z.object({
            name: z.string(),
            age: z.number(),
            preferences: z.object({
              theme: z.enum(['light', 'dark']),
              notifications: z.boolean()
            })
          })
        }),
        settings: z.array(z.string()).optional()
      })
    }

    const result = formatToolsForProvider([complexTool], 'openrouter')
    
    // Verificar que no lanza error
    expect(() => formatToolsForProvider([complexTool], 'openrouter')).not.toThrow()
    
    // Verificar estructura básica
    expect(result[0].function.parameters.type).toBe('object')
  })

  test('Compatibilidad con tools del proyecto', () => {
    // Crear mock de un tool real
    const mockRealTool: ToolDefinition = {
      name: 'generate_image',
      description: 'Generates an image and returns the url of the image.',
      parameters: z.object({
        prompt: z.string().describe('The prompt to use to generate the image with a diffusion model image generator like Dall-E')
      })
    }

    // Verificar que funciona con ambos providers
    expect(() => formatToolsForProvider([mockRealTool], 'openai')).not.toThrow()
    expect(() => formatToolsForProvider([mockRealTool], 'openrouter')).not.toThrow()
  })
})