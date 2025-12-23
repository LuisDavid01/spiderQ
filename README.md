# SpiderQ - Web Crawler AI Agent

> **_NOTE:_** Este proyecto es un experimento y no se recomienda su uso **aun** en produccion.


## Funcionalidades

- Agente conversacional con especializacion en pentest web
- Herramienta de web crawling
- Genera reportes de enpoints encontrados


## Instrucciones de setup

Se requiere **Node.js 20+**
recomiendo usar [pnpm](https://pnpm.io/) aunque tambien pueden usar npm.
```bash
git clone https://github.com/LuisDavid01/spiderQ
cd spiderQ
npm install # or pnpm install
```
## Configuracion

- Crea un archivo `.env` en la raiz del proyecto.
- Guiate del archivo `.env.example` para agregar las variables de entorno necesarias.
- Necesitas crear un archivo `db.json` en la raiz del proyecto con el siguiente contenido:

```json
{
   "messages":[]
}

```

Para hablar con el agente!:
```bash
pnpm chat
# or
npm run chat
```
## Scripts de utilidad
```bash
pnpm db:clean # Limpia la base de datos
# or npm run db:clean

pnpm eval <args> # evaluaciones al LLM
# or npm run eval

pnpm dashboard # Visualizar evaluaciones
# or npm run dashboard

pnpm test # Ejecuta tests unitarios
# or npm run test

```
## Tecnologias usadas
- [OpenAI](https://openai.com) - Inicialmente modelos de lenguaje (gpt-5-nano)
- [typescript](https://www.typescriptlang.org/) - Lenguaje de programacion


### posibles problemas
- Si hay un mensaje corrupto o hay errores por algun prompt eliminar el array `messages` en el archivo
`db.json` y reiniciar el agente.

### recomendaciones
- Eliminar la base de datos es decir el array de `messages` constantemente para no quemar tokens.
