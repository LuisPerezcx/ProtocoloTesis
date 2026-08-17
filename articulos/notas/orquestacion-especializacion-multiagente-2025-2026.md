# Orquestación y especialización de roles en sistemas multiagente LLM (revisión 2026-08-16)

Nota consolidada de la primera ronda de revisión de literatura sobre orquestación, coordinación, especialización de roles y heterogeneidad de herramientas/modelos en sistemas multiagente basados en LLM. Cubre los 3 artículos que David identificó como núcleo, más 5 hallazgos adicionales de una búsqueda dirigida a las preguntas 6-8 de la sesión del 2026-08-16.

Estado: en exploración, línea de investigación **no definitiva**.

**Política de citas (2026-08-16):** solo se cita formalmente (en `bibliografia.bib`) lo que ya tiene venue arbitrada confirmada. Puppeteer, AgentNet y Emergent Coordination sí la tienen (NeurIPS 2025, NeurIPS 2025, ICLR 2026 respectivamente — verificado en `proceedings.neurips.cc` / `proceedings.iclr.cc`, con DOI). AgentCARD, TeamBench, EntCollabBench y la survey de Tran et al. **solo existen en arXiv** al momento de esta revisión — quedan aquí como registro de seguimiento, **no se citan en el protocolo** hasta confirmar que pasaron arbitraje.

## Núcleo (encontrados por David)

### 1. Puppeteer — Dang et al., NeurIPS 2025 [@dang2025puppeteer]

Orquestador central entrenado con aprendizaje por refuerzo que decide dinámicamente qué "puppet" (agente) usar y en qué orden, en vez de una topología fija. Formaliza cada agente como una tripleta *(modelo, patrón de razonamiento, conjunto de herramientas)* — es decir, la heterogeneidad de herramientas ya está en su definición de "agente", pero como parte de un espacio combinatorio grande que el orquestador explora y aprende a explotar, no como una asignación fija diseñada por un investigador. Optimiza desempeño **y** costo simultáneamente (tokens, número de agentes activos, pasos); encuentra que la evolución del orquestador produce estructuras de razonamiento más compactas. Se compara contra MacNet (topología estática tipo DAG) y EvoAgent (generación evolutiva de configuraciones multiagente). Dominio: benchmarks de razonamiento de dominio cerrado y abierto, no ingeniería de software real. Sin orquestador humano — el propio modelo de RL reemplaza esa función.

### 2. Emergent Coordination — Riedl, ICLR 2026 [@riedl2026emergent]

No propone una arquitectura, propone una **metodología de medición**: usa descomposición de información (teoría de la información) para distinguir si un grupo de agentes solo trabaja en paralelo (redundancia) o si realmente coordina de forma complementaria (sinergia). Tarea de prueba: juego abstracto de adivinar números en grupo, sin comunicación directa ni herramientas ni tarea de software. Hallazgo central: pedirle a los agentes que razonen sobre lo que otros agentes podrían estar haciendo ("teoría de la mente") hace que **emerjan roles estables y complementarios sin asignación explícita**, mientras que sin ese tipo de prompting los grupos oscilan sin coordinarse. Aporta las métricas (sinergia/redundancia) que podrían usarse para verificar si la especialización que David quiere estudiar realmente genera complementariedad, en vez de asumirlo.

### 3. AgentNet — Yang et al., NeurIPS 2025 [@yang2025agentnet]

Coordinación **descentralizada**: sin orquestador central, los agentes deciden colectivamente el ruteo de tareas sobre un grafo dinámico (DAG), con un sistema de memoria tipo RAG para que cada agente refine su especialización con el tiempo. Motivación explícita: privacidad y colaboración entre organizaciones (evitar que un controlador central vea todos los datos). La heterogeneidad aquí es de **conocimiento/experiencia acumulada** (vía memoria RAG), no de un conjunto de herramientas asignado a priori por rol. En su sección de trabajo relacionado cita AgentVerse y MorphAgent como marcos de "rol y perfil" que vale la pena revisar.

## Hallazgos adicionales (búsqueda dirigida, 2025-2026)

### 4. AgentCARD / "Specialize Roles, Mix Deployments" — Jiang et al., 2026 [@jiang2026agentcard]

Benchmark que evalúa equipos de agentes LLM con roles fijos (planificador/ejecutor/verificador) variando **qué modelo ocupa cada rol y dónde se hospeda**. Hallazgo: los equipos heterogéneos (distintos modelos por rol) ocupan consistentemente la frontera costo-precisión, mejorando hasta 44% de precisión frente a equipos homogéneos de costo equivalente. El "cuello de botella" de rol depende del dominio (a veces es el planificador, a veces el ejecutor). Es heterogeneidad de **modelo** por rol, no de herramientas por rol — pero metodológicamente es el antecedente más cercano al diseño experimental tipo A-E que David está considerando.

### 5. TeamBench — Kim et al. (MIT / Google Research / Google DeepMind), 2026 [@kim2026teambench]

Muy relevante para conectar con el propio RSM. Benchmark que impone la separación de roles (Planificador/Ejecutor/Verificador) **a nivel de sistema operativo** (contenedores aislados, ningún rol puede leer todo + modificar + certificar), no solo por prompt, y compara contra separación "solo por prompt". Hallazgos clave:
- Los equipos con separación solo por prompt y los que tienen separación forzada por el sistema llegan a tasas de éxito similares, **pero** los equipos solo-por-prompt producen 3.6× más casos en que el Verificador termina reescribiendo el trabajo del Ejecutor — es decir, el rol "se colapsa" aunque el resultado final se vea igual de bien.
- Los verificadores aprueban el 49% de las entregas que fallan la evaluación automática (el verificador "sella de goma").
- El trabajo en equipo ayuda cuando el agente solo ya tiene dificultades, pero **perjudica** cuando el agente solo ya funciona bien (sobrecarga de coordinación).
- Introducen el Teamwork Necessity Index (TNI) para cuantificar si un equipo realmente "vale la pena" frente a un agente solo.

Esto es una versión formalizada y a gran escala de exactamente lo que el RSM observó de forma cualitativa y anecdótica: Gemini CLI invadiendo el rol de Qwen Code. TeamBench sugiere que ese tipo de "invasión de rol" es un fenómeno sistemático, no un accidente de un solo caso — y que ni siquiera forzar límites técnicos (contenedores) lo resuelve del todo en términos de resultado final, aunque sí cambia el comportamiento.

### 6. EntCollabBench / "Beyond the All-in-One Agent" — Yu et al., 2026 [@yu2026entcollabbench]

Benchmark de colaboración multiagente en entornos empresariales simulados: 11 agentes con roles especializados en 6 departamentos, con control de acceso por permisos. Encuentra que los modelos actuales todavía fallan en delegación, transferencia de contexto entre roles, y "cierre" del flujo de trabajo — muy relacionado con el "costo cognitivo de cambio de contexto" que el RSM identificó como una de las tres causas de la desviación de roles.

### Otros marcos mencionados como antecedentes (pendientes de revisar a fondo)

- **AgentVerse, MorphAgent** — especialización de roles y perfiles de agentes (citados por AgentNet).
- **MacNet, EvoAgent** — topologías estáticas vs. evolutivas de MAS (baselines de Puppeteer).
- **AgentScope, MegaAgent** — marcos centrados en escalabilidad, siguen siendo centralizados.
- **Heterogeneous Swarms** (arXiv:2502.04510) — optimización conjunta de "qué modelo" y "qué rol" en sistemas multi-LLM (divide/refine/feedback/irrelevant).
- **AlloBench** (arXiv:2607.23332) — mide si los propios agentes razonan bien sobre cómo asignarse herramientas/recursos bajo presupuesto — ángulo distinto (el agente decide su propia asignación) al de David (el investigador asigna herramientas por rol como variable experimental).
- Encuestas generales: Guo et al. 2024 (IJCAI) [@guo2024llmmassurvey] y una revisión de 2025 sobre mecanismos de colaboración multiagente [@tran2025collabsurvey] — buen punto de entrada para mapear el estado del arte completo antes de cerrar la pregunta de investigación.

## Mapa comparativo rápido

| | Orquestación | Roles | Heterogeneidad estudiada | Dominio de tarea | Métrica de coordinación |
|---|---|---|---|---|---|
| RSM (punto de partida) | Humana | Fijos, diseñados a priori (3) | Herramientas completas (productos ya existentes) | Ingeniería de software real | Ninguna cuantitativa; narrativa de desviaciones |
| Puppeteer | Central, aprendida (RL) | No fijos, elegidos dinámicamente de un espacio grande | Modelo + razonamiento + herramientas, como espacio de búsqueda | Benchmarks de razonamiento | Desempeño y costo (tokens, pasos) |
| Emergent Coordination | Ninguna (emergente) | Emergentes, no asignados | Ninguna (sin herramientas) | Juego abstracto de coordinación | Sinergia/redundancia (teoría de la información) |
| AgentNet | Descentralizada | Dinámicos, evolucionan vía memoria | Conocimiento/experiencia acumulada | Tareas genéricas, colaboración entre organizaciones | Precisión de tarea vs. líneas base |
| AgentCARD | N/A (benchmark) | Fijos (planificador/ejecutor/verificador) | Modelo por rol + modo de despliegue | Multidominio | Frontera costo-precisión, Shapley |
| TeamBench | N/A (benchmark) | Fijos, forzados a nivel de SO | Ninguna deliberada (mismo o distinto modelo por rol) | Ingeniería de software, datos, incidentes | Teamwork Necessity Index, tasa de colapso de rol |
| EntCollabBench | N/A (benchmark) | Fijos, con control de acceso | Ninguna deliberada | Flujos empresariales simulados | Tasas de éxito en delegación/cierre de flujo |

## Lectura del hueco (para discutir, no es conclusión cerrada)

Ningún trabajo revisado hasta ahora aísla **la heterogeneidad de conjuntos de herramientas por rol** (a diferencia de heterogeneidad de modelo por rol, que sí está bastante cubierta por AgentCARD/Heterogeneous Swarms) como variable experimental controlada, comparando explícitamente configuración de agente único, multiagente homogéneo, multiagente especializado por rol, y multiagente especializado por rol + herramientas heterogéneas — en una tarea real (no un benchmark abstracto ni un juego). El campo se mueve muy rápido: varios de estos trabajos son de los últimos 2-3 meses (mayo-junio 2026), así que esta lectura debe repetirse antes de cerrar la pregunta de investigación.

## Palabras clave y líneas de búsqueda sugeridas

- "role specialization" + "tool heterogeneity" / "heterogeneous toolset" LLM agents
- "multi-agent orchestration" + "ablation" (para encontrar diseños de comparación tipo A-E)
- "role separation" + "enforced" / "structural enforcement" LLM agents
- "cost-accuracy" / "cost-performance frontier" multi-agent LLM
- "teamwork necessity" / "when does multi-agent help" LLM
- "agent capability" + "tool assignment" OR "tool allocation"
- "centralized vs decentralized orchestration" LLM agents
- "human-in-the-loop" multi-agent LLM orchestration (para no perder de vista el ángulo del RSM, que sí tiene humano)
- Buscar directamente en NeurIPS 2025, ICLR 2026 y arXiv cs.MA / cs.AI de los últimos 3 meses (el campo publica más rápido de lo que se puede leer).
