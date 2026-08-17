# RSM (Role Specialization Model) — Síntesis en español, organizada por sección

**Artículo:** The Role Specialization Model (RSM): Coordinating LLM-Based Tools in Agentic Software Development – An Exploratory Case Study
**Autores:** Carlos Alberto Fernández-y-Fernández (UTM), Jorge R. Aguilar Cisneros (UPAEP)
**PDF original:** `articulos/pdfs/RSM_Role Specialization Model_v6_unlinked_unnumbered.pdf`

> Nota de método: esto es una síntesis fiel y completa del contenido del artículo, sección por sección, escrita en mis propias palabras — no una traducción literal línea por línea del texto (por derechos de autor no reproduzco el artículo completo, ni siquiera traducido). Cubre todo lo sustantivo: motivación, marco teórico, diseño, ejecución, resultados y conclusiones. Los fragmentos entre comillas son citas puntuales (p. ej. los prompts usados en el estudio). Si necesitas la redacción exacta de algún párrafo específico, dime cuál y te lo cito directamente.

## Resumen (abstract)

Estudio de caso exploratorio que coordina tres herramientas LLM —Antigravity (IDE agéntico, backend Gemini), Gemini CLI y Qwen Code (local, Ollama)— bajo un marco de reparto de roles propuesto por los autores: el **Role Specialization Model (RSM)**. Se guía por tres preguntas: (RQ1) cómo coordinar herramientas LLM distintas mediante el RSM en un flujo real; (RQ2) qué desviaciones surgen respecto al reparto planeado y por qué; (RQ3) cómo queda el producto resultante frente a ISO/IEC 25010. El caso de aplicación es una app de escritorio en Python para visualizar datos climáticos, desarrollada de forma incremental. Conclusión general: la coordinación explícita de roles ayuda a organizar el ciclo de desarrollo y la calidad arquitectónica, pero exige estrategias deliberadas de coordinación, gestión de contexto, y verificación humana constante.

## 1. Introducción

La ingeniería de software está migrando hacia lo que los autores (siguiendo a Hassan et al.) llaman SE 3.0 o "ingeniería de software agéntica": el desarrollador deja de escribir código directamente y pasa a actuar como arquitecto, mentor y evaluador de agentes autónomos. Dentro de ese contexto surge el *vibe coding* (Karpathy, 2025): programar conversacionalmente, priorizando el resultado percibido sobre entender el código generado — lo cual democratiza el desarrollo pero genera dudas sobre confiabilidad arquitectónica y erosión de competencias técnicas.

Los autores identifican un hueco poco explorado: coordinar *varias* herramientas LLM con roles diferenciados dentro de un mismo flujo, en vez de usar una sola. Proponen el RSM y lo aplican con tres herramientas (Antigravity, Gemini CLI, Qwen Code), cada una con un dominio de responsabilidad distinto.

Contribuciones declaradas: (a) el marco RSM en sí; (b) documentación completa de un flujo guiado por RSM y sus desviaciones; (c) técnicas de *prompt hardening* observadas; (d) evaluación cualitativa bajo ISO/IEC 25010; (e) análisis de amenazas a la validez para facilitar réplicas.

## 2. Trabajo relacionado

- **SE 3.0 (Hassan et al.):** modelo de 5 niveles de autonomía (de sugerencias inline hasta autonomía general); el salto al Nivel 3 exige rediseñar actores, procesos, herramientas y artefactos; el humano se vuelve "Agent Coach". Li et al. aportan el dataset AIDev mostrando que los agentes ya leen código, planean cambios, generan código y hacen pull requests.
- **Vibe coding:** Sarkar y Drosos muestran empíricamente que sigue un ciclo iterativo de prompting–evaluación–edición manual, y que no elimina la necesidad de experiencia en programación. Persisten preocupaciones sobre "deuda cognitiva".
- **Generación de código y sistemas multiagente:** desde Codex/AlphaCode hasta benchmarks como HumanEval/MBPP, el desempeño cae en tareas multiarchivo o de arquitectura. MetaGPT y ChatDev ya demuestran que repartir roles de equipo de software (analista, diseñador, programador, revisor) entre instancias de LLM mejora la calidad final — el RSM se diferencia porque coordina herramientas *distintas* (no instancias de un mismo modelo) con un humano orquestando.
- **Seguimiento de instrucciones y contexto:** el benchmark AGENTIF documenta "degradación por densidad de restricciones" (más instrucciones simultáneas → peor desempeño). Li et al. documentan que el razonamiento *chain-of-thought* explícito a veces empeora el seguimiento de instrucciones simples, porque desvía la atención del modelo. Un estudio de ETH Zúrich muestra que archivos de reglas de proyecto demasiado detallados también degradan el desempeño; recomiendan agregar reglas solo cuando se demuestra un error recurrente.
- **Herramientas de asistencia (GitHub Copilot, etc.):** mejoran velocidad pero generan exceso de confianza y menor comprensión del código. El RSM aporta algo poco documentado: la interacción entre *múltiples* herramientas agénticas a lo largo de todo un ciclo de desarrollo.

## 3. Diseño del estudio de caso

- **Método:** estudio de caso exploratorio (Runeson & Höst; Yin), no experimento controlado. Unidad de análisis: el propio RSM (adherencia a roles, desviaciones, calidad del artefacto). Datos: observación directa y documentación sistemática de prompts, salidas, desviaciones y pruebas. Análisis cualitativo por *pattern-matching* contra las 3 preguntas de investigación.
- **Herramientas:** Antigravity (IDE agéntico open-source sobre VS Code, backend Gemini 3 Flash — no Pro, aclaran los autores); Gemini CLI (línea de comandos, buena en tareas multiarchivo, documentación y automatización por redirección de salida); Qwen Code (modelo de Alibaba especializado en código, ejecutado localmente vía Ollama para preservar privacidad).
- **El RSM en sí:** inspirado en la separación de responsabilidades de Dijkstra, pero aplicada a herramientas, no a código. Tres roles:
  - Antigravity → **Arquitecto** (gestión multiarchivo, visión macro, refinamiento iterativo).
  - Gemini CLI → **Analista** (procesamiento masivo, documentación, auditoría arquitectónica).
  - Qwen Code → **Especialista** (validación de datos, pruebas unitarias, privacidad).
  Los autores aclaran que esta distribución *no es estática* — en la ejecución real hubo desviaciones (ver sección 4.3/5.2).
- **Proyecto caso:** "Climate Data Visualizer", app de escritorio en Python (Tkinter + Pandas + Matplotlib) para cargar CSV de temperatura/humedad y graficarlos, elegida por tocar varias capas técnicas (GUI, datos, visualización, validación, pruebas) para que los tres roles tuvieran trabajo real.
- **Evaluación de calidad:** frente a ISO/IEC 25010:2011, como evaluación cualitativa de experto (el propio primer autor), no medición cuantitativa — limitación que los propios autores reconocen y discuten en la sección de amenazas a la validez.

## 4. Ejecución del estudio de caso

1. **Fase 1 (Antigravity, Arquitecto):** con un prompt simple en lenguaje natural ("Crea un proyecto en Python para visualizar datos climáticos... interfaz con Tkinter... cargar CSV... graficar temperatura y humedad..."), Antigravity generó de forma autónoma toda la estructura inicial del proyecto (código, scripts, docs, datos de ejemplo). Hallazgo relevante: el código generado fue funcional pero **monolítico** (una sola clase mezclaba interfaz, carga de datos, validación y graficado), violando separación de responsabilidades — esto motivó la auditoría de la Fase 2.
2. **Fase 2 (Gemini CLI, Analista):**
   - Generar un CSV de 100 registros de prueba reveló que el agente intentaba invocar herramientas no disponibles en la terminal restringida — comportamiento consistente con la "degradación por densidad de restricciones". Solo funcionó tras endurecer el prompt con restricciones negativas explícitas (p. ej. *"NO ejecutes comandos. NO uses herramientas. Solo escribe los datos como texto plano."*).
   - La auditoría arquitectónica identificó 4 problemas (violación de SoC, recreación ineficiente del objeto Figure de Matplotlib, falta de type hints, manejo de excepciones demasiado amplio) y Gemini CLI mismo implementó las mejoras, creando una clase `DataModel` separada (patrón tipo MVC).
3. **Fase 3 (desviación del plan):** la refactorización estaba asignada a Qwen Code, pero Gemini CLI la asumió espontáneamente al hacer el análisis de la Fase 2. Qwen Code terminó con un alcance más chico: el módulo `validators.py` (validación de formato de fecha) y una suite de 10 pruebas unitarias, todas exitosas — aunque los autores aclaran que solo cubren nivel unitario, faltarían pruebas de integración/sistema.
4. **Fase 4 (Antigravity):** agregó funciones extra no pedidas originalmente (panel de estadísticas en tiempo real, tooltips interactivos, suavizado por promedio móvil, exportación a PNG). El entorno virtual se corrompió durante esta fase y el agente se adaptó modificando el script de arranque para instalar dependencias a nivel de sistema como respaldo.
5. **Fase 5 (Gemini CLI):** consolidó la documentación (README + guía rápida) con historial de versiones.

## 5. Resultados y discusión

- **RQ3 — Calidad (ISO/IEC 25010):** alta adecuación funcional, mantenibilidad (gracias a `DataModel`, type hints) y flexibilidad; **confiabilidad moderada**, no por el código sino por la fragilidad del entorno de ejecución (corrupción del venv). Conclusión de los autores: la calidad del software agéntico depende también de la robustez del entorno, no solo del código generado.
- **RQ2 — Desviaciones:** la principal fue Gemini CLI tomando la tarea de Qwen Code. Tres causas concurrentes: (1) no había límite de alcance explícito entre fases; (2) las dos herramientas se solapan funcionalmente en tareas de refactorización; (3) inercia de flujo — cambiar de herramienta a mitad de tarea implica un costo cognitivo alto (transferir contexto, reexplicar lo ya hecho, verificar consistencia), así que fue más pragmático seguir con Gemini CLI. Los autores conectan esto con la literatura de sistemas multiagente: cuando los agentes tienen capacidades solapadas, es difícil mantener particiones estrictas de responsabilidad, y el humano orquestador debe intervenir activamente si quiere preservar el reparto planeado. También se observó que Antigravity ignoró inicialmente el formato de fecha pedido — explicado post-hoc por la "paradoja CoT" (al razonar sobre el diseño global, el agente desatendió una restricción de formato puntual).
- **RQ1 — Efectividad comparativa:** Antigravity destacó en generación multiarchivo coherente desde un solo prompt; Gemini CLI en generación masiva de datos, análisis arquitectónico y documentación; Qwen Code cumplió su rol acotado de validación y pruebas.
- **Desafíos recurrentes identificados:** sensibilidad al prompt (requirió varias iteraciones), necesidad constante de verificación humana (a pesar de pasar todas las pruebas), y gestión explícita de contexto (hubo que reexplicar código/estado del proyecto varias veces a los agentes).
- **Limitación reconocida:** dos de las tres herramientas comparten el mismo modelo base (Gemini), lo que reduce la diversidad cognitiva del conjunto y puede explicar parte del solapamiento de roles. Los autores aclaran que esto es limitación de *esta instanciación*, no del RSM como marco (que es agnóstico al backend). Proponen como trabajo futuro un toolset heterogéneo (p. ej. combinar un modelo local Anthropic o Meta con un IDE agéntico de Google).
- **Extensión propuesta:** agregar un cuarto agente con rol explícito de "evaluador" (paradigma *LLM-as-a-Judge*), para reducir la carga de auditoría del humano, siempre que se controlen sesgos conocidos del paradigma (posicional, de verbosidad, de autoafirmación).
- **Implicaciones sociotécnicas:** el valor del desarrollador se desplaza de la sintaxis hacia la orquestación, especificación clara de objetivos y validación de salidas. Se advierte que las herramientas agénticas benefician más a ingenieros con experiencia (actúan como "multiplicadores de fuerza") mientras que developers junior tienen más dificultad para "dirigir" agentes — efecto que llaman *AI drag*.
- **Patrones LLMOps identificados:** prompts versionados como código, separación entre plan (aprobado por humano) y ejecución (probabilística), y enrutamiento inteligente (tareas rutinarias a modelos locales pequeños, cambios arquitectónicos grandes a modelos de nube potentes).
- **Seguridad agéntica:** la autonomía de agentes con acceso a sistema de archivos y terminal abre superficie de ataque, en particular *prompt injection* indirecta (instrucciones maliciosas escondidas en datos que el agente procesa sin validar). En el estudio esto se manifestó de forma benigna (corrupción de entorno, intentos de ejecutar comandos), pero los autores advierten del potencial de escalamiento en producción (comprometer API keys, configuraciones críticas).
- **Amenazas a la validez** (marco de Wohlin et al.): validez interna limitada por sesgo de un solo observador/investigador; validez externa limitada por ser un caso único con homogeneidad de modelo; validez de constructo limitada porque la evaluación ISO/IEC 25010 fue cualitativa, no cuantitativa; confiabilidad limitada porque no hubo replicación (el comportamiento de los agentes es probabilístico).
- **Validación teórica (no empírica) del RSM:** los autores argumentan consistencia con tres cuerpos de conocimiento ya validados — separación de responsabilidades de Dijkstra, especialización de roles multiagente (MetaGPT, ChatDev) y el marco SE 3.0 de Hassan et al. — como forma de "triangulación teórica" que sostiene la plausibilidad del modelo mientras no exista replicación empírica.

## 6. Conclusiones

- La especialización de roles es un principio de diseño válido para coordinar múltiples herramientas LLM, pero **necesita límites de alcance explícitos** para evitar solapamientos no deseados.
- El *prompt hardening* con restricciones negativas fue clave para la integridad de las salidas en este estudio (aunque se necesitan más casos para confirmar que generaliza).
- La verificación humana sigue siendo indispensable.
- Se aportó evidencia real (no solo de laboratorio) de la paradoja CoT y de la degradación por densidad de restricciones.
- Trabajo futuro propuesto explícitamente por los autores: agente evaluador tipo LLM-as-a-Judge; toolset heterogéneo entre proveedores; proyectos a mayor escala; métricas cuantitativas de efectividad de orquestación; estudio longitudinal del efecto en competencias técnicas de developers junior vs. senior.

## Tablas del artículo (resumidas)

- **Tabla 1** — 5 niveles de autonomía en IA para desarrollo de software (de sugerencias inline a autonomía general), adaptada de Hassan et al.
- **Tabla 2** — reparto de roles del RSM: Antigravity=Arquitecto, Gemini CLI=Analista, Qwen Code=Especialista, con modo de ejecución y fortaleza principal de cada uno.
- **Tabla 3** — las 3 iteraciones de prompt hardening para generar el CSV (de fallo a éxito).
- **Tabla 4** — evaluación ISO/IEC 25010: alto en adecuación funcional, mantenibilidad, capacidad de interacción y flexibilidad; moderado en confiabilidad; mejora medible en eficiencia de desempeño tras la refactorización.
- **Tabla 5** — cambio de valores profesionales SE 1.0/2.0 → SE 3.0 (de "escribir algoritmos a mano" a "arquitectura y diseño"; de "depurar sintaxis" a "orquestar y revisar agentes"; etc.).

## Referencias más relevantes para el protocolo

- Hassan, A.E. et al. — *Agentic Software Engineering: Foundational Pillars and a Research Roadmap* (2025) — marco SE 3.0.
- Hong, S. et al. — *MetaGPT* (2023); Qian, C. et al. — *ChatDev* (2024) — especialización de roles multiagente.
- Dijkstra, E.W. — *On the Role of Scientific Thought* (1982) — separación de responsabilidades.
- Qi, Y. et al. — *AGENTIF* (2025) — degradación por densidad de restricciones.
- Li, X. et al. — *When Thinking Fails* — paradoja del razonamiento CoT.
- ISO/IEC 25010:2011 y 25010:2023 — modelo de calidad de producto de software.

*(Lista completa de las 28 referencias disponible en el PDF original, `articulos/pdfs/RSM_Role Specialization Model_v6_unlinked_unnumbered.pdf`.)*
