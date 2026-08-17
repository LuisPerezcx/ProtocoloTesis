# RSM — Role Specialization Model (Fernández-y-Fernández & Aguilar Cisneros)

**Título completo:** The Role Specialization Model (RSM): Coordinating LLM-Based Tools in Agentic Software Development – An Exploratory Case Study
**Autores:** Carlos Alberto Fernández-y-Fernández¹\* (Instituto de Computación, UTM), Jorge R. Aguilar Cisneros² (Decanato de Ingenierías, UPAEP)
**Estado:** leído / punto de partida del protocolo
**PDF:** `articulos/pdfs/RSM_Role Specialization Model_v6_unlinked_unnumbered.pdf`
**Traducción completa (ES):** `articulos/traducciones/RSM-role-specialization-model_traduccion.md`

> **Nota importante:** este artículo es de la autoría del Dr. Carlos Alberto Fernández-y-Fernández, director de tesis de David. No es solo "trabajo relacionado" — es el punto de partida directo del protocolo.

## De qué trata

Es un estudio de caso exploratorio (no experimento controlado) que propone el **RSM**: un marco para coordinar tres herramientas LLM distintas —Antigravity (IDE agéntico, backend Gemini), Gemini CLI y Qwen Code (local, vía Ollama)— asignándoles roles fijos y complementarios (Arquitecto / Analista / Especialista) dentro de un flujo de desarrollo de software, con un humano como orquestador. Se aplica al desarrollo incremental de una app de escritorio en Python (Climate Data Visualizer).

Tres preguntas de investigación:
- **RQ1** — ¿cómo se coordinan herramientas LLM heterogéneas mediante el RSM en un flujo real?
- **RQ2** — ¿qué desviaciones ocurren respecto al reparto de roles planeado, y por qué?
- **RQ3** — ¿cómo queda el producto resultante frente a ISO/IEC 25010?

## Hallazgos principales

- El RSM sí aporta una base estructurada de coordinación, pero en la ejecución real **Gemini CLI invadió el rol asignado a Qwen Code** (refactorización arquitectónica) por tres factores concurrentes: falta de límites de alcance explícitos entre fases, solapamiento de capacidades entre herramientas, e inercia del flujo de trabajo (el costo cognitivo de cambiar de herramienta a mitad de tarea).
- El *prompt hardening* (restricciones negativas explícitas) fue crítico para evitar que los agentes ejecutaran comandos no autorizados.
- Evaluación cualitativa ISO/IEC 25010: alta adecuación funcional, mantenibilidad y flexibilidad; confiabilidad **moderada** por fragilidad del entorno de ejecución (no del código).
- Se documentan en condiciones naturales dos fenómenos ya reportados en la literatura: la "paradoja CoT" (razonar en cadena puede degradar el seguimiento de instrucciones simples) y la "degradación por densidad de restricciones".
- Validación del RSM es **teórica** (consistencia con separación de responsabilidades de Dijkstra, con MetaGPT/ChatDev, y con el marco SE 3.0 de Hassan et al.), no empírica-replicada.

## Limitaciones que el propio artículo reconoce (= posibles huecos para la tesis)

1. **Caso único, un solo investigador, un solo proyecto** — sin replicación. Amenaza a validez externa reconocida explícitamente.
2. **Homogeneidad de modelo**: dos de las tres herramientas (Antigravity y Gemini CLI) corren sobre el mismo backend (Gemini). Los autores mismos proponen como trabajo futuro un toolset heterogéneo (p. ej. combinar un modelo Anthropic o Meta local con un IDE agéntico de Google).
3. **Evaluación de calidad cualitativa y de un solo evaluador** (el propio autor), no cuantitativa ni con métricas objetivas (complejidad ciclomática, tiempos de respuesta medidos, etc.).
4. **No hay límites de alcance (scope boundaries) formalizados** entre roles — el artículo identifica esto como causa de la desviación observada, pero no propone un mecanismo concreto para prevenirla.
5. **No hay agente evaluador/juez** — la auditoría recae 100% en el humano; los autores sugieren un cuarto rol tipo "LLM-as-a-Judge" pero no lo implementan ni evalúan.
6. **Sin métricas cuantitativas de efectividad de la orquestación** (por ejemplo: tasa de desviación de rol, tiempo de intervención humana, costo de cambio de contexto).
7. **Sin estudio longitudinal** sobre el efecto en las competencias técnicas de desarrolladores junior vs. senior ("AI drag").

## Por qué es un buen punto de partida para el protocolo

El artículo da tres cosas que ya están resueltas y no hay que "reinventar":
- Un marco conceptual con nombre y estructura (RSM: roles Arquitecto/Analista/Especialista + orquestador humano).
- Un vocabulario técnico ya validado (prompt hardening, constraint-density degradation, paradoja CoT, SoC aplicado a herramientas, SE 3.0).
- Una lista explícita de limitaciones/trabajo futuro escrita por el propio director — es prácticamente un mapa de posibles problemas de tesis.

Para la sección de **Descripción del problema**, los huecos 1, 2, 4 y 6 de arriba son los más "acotables" como problema de tesis (a diferencia de 3, 5 y 7, que son más ambiciosos o requieren más recursos):
- Formalizar y probar mecanismos de **límites de alcance explícitos** entre roles del RSM para reducir la tasa de desviación (huecos 1 y 4).
- Evaluar el RSM con un **toolset heterogéneo** (distintos proveedores de modelo) para ver si la diversidad de backend cambia el patrón de desviaciones (hueco 2).
- Proponer **métricas cuantitativas de efectividad de orquestación** que hoy no existen (hueco 6), y usarlas para comparar RSM contra una línea base sin roles definidos.

## Referencias clave citadas que probablemente reaparezcan en el protocolo

- Hassan et al. — *Agentic Software Engineering: Foundational Pillars and a Research Roadmap* (marco SE 3.0, niveles de autonomía).
- Hong et al. — *MetaGPT* / Qian et al. — *ChatDev* (especialización de roles multiagente).
- Dijkstra — *On the Role of Scientific Thought* (separación de responsabilidades).
- Qi et al. — *AGENTIF* (degradación por densidad de restricciones).
- Li et al. — *When Thinking Fails* (paradoja del razonamiento CoT).
- ISO/IEC 25010:2011 y 25010:2023 (modelo de calidad de producto de software).
