# Bitácora de artículos

Tabla de referencia rápida. Un renglón por artículo. El campo **Nota**
enlaza al archivo con el detalle (si existe) en `notas/`.

Cómo usarla: cuando encuentres un artículo interesante, agrega una fila
aquí. Si crees que lo vas a necesitar a fondo más adelante (para citar
puntos específicos sin releerlo), crea también su nota en
`notas/<slug>.md` (ver `notas/_ejemplo.md` como plantilla).

| Título | Autores | Año | Link | Tags | Resumen (1 línea) | Estado | Nota |
|---|---|---|---|---|---|---|---|
| _Ejemplo: UML Distilled_ | Fowler, Scott | 1997 | – | uml, modelado | Introduce UML como lenguaje estándar de modelado. | leído | [notas/_ejemplo.md](notas/_ejemplo.md) |
| The Role Specialization Model (RSM): Coordinating LLM-Based Tools in Agentic Software Development | Fernández-y-Fernández, C.A.; Aguilar Cisneros, J.R. | 2025/2026 | `articulos/pdfs/RSM_Role Specialization Model_v6_unlinked_unnumbered.pdf` | agentic-se, llm, multi-agente, role-specialization, punto-de-partida | Marco RSM para coordinar 3 herramientas LLM con roles fijos (Arquitecto/Analista/Especialista); estudio de caso exploratorio, no replicado. | leído | [notas/rsm-role-specialization-model.md](notas/rsm-role-specialization-model.md) |
| Multi-Agent Collaboration via Evolving Orchestration (Puppeteer) | Dang, Y. et al. | 2025 | https://arxiv.org/abs/2505.19591 | orquestación, RL, eficiencia, multiagente | Orquestador central entrenado por RL que elige agentes dinámicamente; optimiza desempeño y costo simultáneamente. | leído | [notas/orquestacion-especializacion-multiagente-2025-2026.md](notas/orquestacion-especializacion-multiagente-2025-2026.md) |
| Emergent Coordination in Multi-Agent Language Models | Riedl, C. | 2026 | https://arxiv.org/abs/2510.05174 | coordinación, sinergia, teoría-de-la-información | Marco para medir si un grupo de agentes coordina de verdad (sinergia) o solo trabaja en paralelo (redundancia). | leído | [notas/orquestacion-especializacion-multiagente-2025-2026.md](notas/orquestacion-especializacion-multiagente-2025-2026.md) |
| AgentNet: Decentralized Evolutionary Coordination for LLM-based Multi-Agent Systems | Yang, Y. et al. | 2025 | https://arxiv.org/abs/2504.00587 | descentralizado, especialización, privacidad | Coordinación descentralizada vía grafo dinámico y memoria RAG, sin orquestador central. | leído | [notas/orquestacion-especializacion-multiagente-2025-2026.md](notas/orquestacion-especializacion-multiagente-2025-2026.md) |
| Specialize Roles, Mix Deployments (AgentCARD) | Jiang, Y. et al. | 2026 | https://arxiv.org/abs/2606.20629 | heterogeneidad-de-modelo, costo-precisión, benchmark, **preprint-no-citar** | Equipos con distinto modelo por rol dominan la frontera costo-precisión frente a equipos homogéneos. Solo en arXiv — no citar en el protocolo hasta confirmar venue arbitrada. | seguimiento | [notas/orquestacion-especializacion-multiagente-2025-2026.md](notas/orquestacion-especializacion-multiagente-2025-2026.md) |
| TeamBench: Evaluating Agent Coordination under Enforced Role Separation | Kim, Y. et al. | 2026 | https://arxiv.org/abs/2605.07073 | separación-de-roles, benchmark, verificador, **preprint-no-citar** | Separación de roles forzada a nivel de SO; cuantifica colapso de rol y verificadores que aprueban trabajo defectuoso. Solo en arXiv — no citar hasta confirmar venue arbitrada. | seguimiento | [notas/orquestacion-especializacion-multiagente-2025-2026.md](notas/orquestacion-especializacion-multiagente-2025-2026.md) |
| Beyond the All-in-One Agent (EntCollabBench) | Yu, T. et al. | 2026 | https://arxiv.org/abs/2605.08761 | empresarial, delegación, benchmark, **preprint-no-citar** | Benchmark de colaboración multiagente empresarial con control de acceso; agentes fallan en delegación y transferencia de contexto. Solo en arXiv — no citar hasta confirmar venue arbitrada. | seguimiento | [notas/orquestacion-especializacion-multiagente-2025-2026.md](notas/orquestacion-especializacion-multiagente-2025-2026.md) |

<!--
Agrega tus filas nuevas debajo de esta línea, por ejemplo:
| Título del artículo | Apellido, N. | 2025 | https://... | tag1, tag2 | Qué resuelve en una línea. | pendiente / leído | notas/slug.md |
-->
