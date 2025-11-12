### Evaluando SpiderQ

Para realizar evaluaciones, se debe ejecutar el siguiente comando:

```bash
npm run eval nombre-del-experimento
# or 
# pnpm eval nombre-del-experimento
```

Para realizar evaluaciones se debe tomar encuenta lo siguiente:

- Un archivo `results.json` en el directorio raíz del proyecto si no lo tienes, se creará automaticamente.
- Dentro del directorio `experiments` se deben agregar los archivos por experimento.
- El archivo debe tener el nombre `nombre-del-experimento.eval.ts`
- Autoevals se encargará de evaluar el archivo y guardará los resultados en `results.json`

## Buenos ejemplos  de evaluaciones

- Determinar si se llama la función correcta en el mensaje de entrada
- Determinar el output correcto de una llamada a la API

## Malos ejemplos de evaluaciones

- Una operacion matematica.
- Esperar un mensaje especifico.
- Cualquier cosa que sea determinista.

## UI

Puedes visualizar los resultados de las evaluaciones  en  una  aplicacion de React usando el siguiente comando:

```bash
npm run dashboard
# or
# pnpm dashboard
```

