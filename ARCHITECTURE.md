# 🏗️ OmniDice — Documento de Arquitetura

## Visão Geral

OmniDice é uma aplicação **Single Page Application (SPA)** React que renderiza dados 3D com física realista usando Three.js e Rapier. A arquitetura segue um padrão de **stores centralizadas** com Zustand e separação clara entre **UI (components/)** e **motor 3D (engine/)**.

---

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                           │
│  (Orquestrador — monta todos os componentes)             │
└──────┬──────────────────────────────────────────┬───────┘
       │                                          │
       ▼                                          ▼
┌──────────────┐                          ┌──────────────┐
│  Components  │  (UI Layer)               │   Engine     │  (3D Layer)
│              │                           │              │
│ ControlPanel │──seleciona dados─────────▶│ DiceRoll     │
│ DiceBox      │──renderiza canvas────────▶│ Dice         │
│ ThemeSelector│──troca tema──────────────▶│ DiceMesh     │
│ MaterialSel. │──troca material──────────▶│ DiceMaterial │
│ VirtualCamera│──captura stream──────────▶│ Canvas       │
│ ResultsDisp. │◀──resultados──────────────│ DiceThrower  │
│ RollHistory  │◀──histórico───────────────│              │
└──────────────┘                          └──────────────┘
       │                                          │
       └────────────┬─────────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │    Store      │  (Zustand)
            │               │
            │ diceStore     │── estado dos dados, rolagens, física
            │ themeStore    │── temas de cena (5 temas)
            │ cameraStore   │── modo câmera virtual
            │ materialStore │── material/skin dos dados
            │ customSkinSt. │── skins customizadas
            └──────────────┘
```

---

## Fluxo de uma Rolagem

```
1. Usuário seleciona dados no ControlPanel
   └─▶ diceStore.setDiceCount(type, count)

2. Usuário clica "Roll"
   └─▶ diceStore.startRoll()
       ├─▶ DiceThrower gera posições/rotações/velocidades aleatórias
       ├─▶ Cria objeto Dice com throws para cada dado
       └─▶ Incrementa rollKey (força recriação do mundo físico)

3. DiceBox detecta currentRoll
   └─▶ Renderiza <DiceRoll> com <Physics> (Rapier)
       └─▶ Cada <Dice> é lançado com seu DiceThrow

4. Rapier simula física deterministicamente
   └─▶ Cada dado colide com a bandeja e para

5. Quando um dado para:
   └─▶ onDieFinished(id, value, transform)
       ├─▶ Armazena resultado em currentResults
       └─▶ Quando todos param:
           ├─▶ Calcula total + modificador
           ├─▶ Adiciona ao rollHistory
           └─▶ Exibe no ResultsDisplay
```

---

## Camadas da Aplicação

### 1. UI Layer (`src/components/`)

Componentes React puros que renderizam a interface do usuário. Não contêm lógica 3D.

| Componente | Responsabilidade |
|---|---|
| **App.tsx** | Orquestrador raiz, monta todos os componentes |
| **ControlPanel** | Seleção de dados (d4-d100, Fudge), modificador, botão Roll |
| **DiceBox** | Container do canvas Three.js, renderiza DiceRoll |
| **ThemeSelector** | Botões para trocar entre 5 temas de cena |
| **MaterialSelector** | Botões para trocar skin dos dados (Divine/Color/Custom) |
| **ResultsDisplay** | Overlay com resultado da última rolagem |
| **RollHistory** | Lista lateral com histórico de rolagens |
| **VirtualCamera** | Sistema de streaming: modo câmera, pop-out, PiP |
| **CustomSkinCreator** | Interface para criar skins customizadas |
| **CameraControls** | Controles de órbita da câmera 3D |

### 2. Engine Layer (`src/engine/`)

Lógica 3D pura: física, renderização, materiais, malhas. Não depende de stores.

| Módulo | Responsabilidade |
|---|---|
| **dice/DiceRoll.tsx** | Container com `<Physics>` Rapier, renderiza todos os dados |
| **dice/Dice.tsx** | Componente 3D de um dado individual (mesh + material) |
| **meshes/DiceMesh.tsx** | Carrega modelos .glb para cada tipo de dado |
| **materials/DiceMaterial.tsx** | Aplica material PBR baseado no DiceStyle |
| **materials/divine_*/** | Texturas e configurações das 10 skins Divine |
| **materials/color/** | Materiais de cor sólida (10 variantes) |
| **materials/custom/** | Material customizado pelo usuário |
| **materials/fudge/** | Material especial para dado Fudge (+/−/blank) |
| **helpers/DiceThrower.ts** | Gera posições/rotações/velocidades aleatórias |
| **helpers/random.ts** | Função de randomização (determinística) |
| **colliders/** | Colisores físicos para cada tipo de dado |
| **audio/** | Sistema de áudio para sons de rolagem |
| **types/** | Tipos TypeScript: Die, Dice, DiceThrow, DiceStyle, etc. |

### 3. Store Layer (`src/store/`)

Estado global com Zustand. Comunicação entre UI e Engine.

| Store | Estado gerenciado |
|---|---|
| **diceStore** | Dados selecionados, rolagem atual, resultados, histórico, física |
| **themeStore** | Tema atual, 5 temas pré-definidos (persistido em localStorage) |
| **cameraStore** | Modo câmera virtual, transições, streaming |
| **diceMaterialStore** | Material/skin atual dos dados (persistido) |
| **customSkinStore** | Skins customizadas criadas pelo usuário |

### 4. Types Layer (`src/types/`)

Definições de tipos TypeScript compartilhadas.

| Arquivo | Tipos |
|---|---|
| **dice.types.ts** | DiceType, DiceSelection, RollResult, ThemeConfig, DiceMaterial |

---

## Stack Tecnológica

```
React 18 ──────────── UI Framework
TypeScript ────────── Type safety
Three.js ──────────── Renderização 3D
@react-three/fiber ── React + Three.js bridge
@react-three/drei ─── Utilitários (OrbitControls, Environment, etc.)
@react-three/rapier ─ Física determinística (Rapier)
Zustand ───────────── State management
Vite ──────────────── Build tool
```

---

## Sistema de Temas

Cada tema define:
- **Floor:** Cor, tipo (felt/wood/stone/metal), roughness, metalness
- **Walls:** Cor, roughness, metalness, emissive opcional
- **Background:** Cor de fundo do canvas
- **Lighting:** Luz ambiente, direcional, ponto
- **Fog:** Névoa atmosférica
- **Portal:** Cor emissiva do portal de entrada dos dados

Temas são persistidos em `localStorage` via Zustand `persist`.

---

## Sistema de Skins (DiceStyle)

### Skins Divine (10)
Texturas completas com albedo, normal map, ORM (occlusion/roughness/metallic):
Amethyst, Blood, Emerald, Gold, Ice, Nebula, Obsidian, Pearl, Sapphire, Void

### Skins Color (10)
Cores sólidas com parâmetros PBR ajustáveis:
Crimson, Royal Blue, Forest, Steel, Copper, Rose Gold, Neon Pink, Neon Green, Ivory, Midnight

### Custom
Criada pelo usuário via CustomSkinCreator.

---

## Virtual Camera — Fluxo de Streaming

```
1. Usuário pressiona F2
   └─▶ cameraStore.toggleCameraMode()
       └─▶ isCameraMode = true
           └─▶ UI esconde (opacity: 0, pointerEvents: none)
           └─▶ Canvas permanece visível

2. Opções de streaming:
   ├─▶ Pop-Out Window: Abre janela borderless com <video>
   │   └─▶ Ideal para OBS Window Capture
   ├─▶ Picture-in-Picture: PiP nativo do navegador
   └─▶ Canvas captureStream(30): MediaStream a 30fps

3. Sair: ESC ou F2
   └─▶ cameraStore.exitCameraMode()
```

---

## Determinismo da Física

O Rapier é um motor de física **determinístico**: dados os mesmos parâmetros iniciais (posição, rotação, velocidades), o resultado é sempre o mesmo em qualquer computador. Isso permite:

- Sincronização de rolagens em rede (futuro)
- Resultados justos e auditáveis
- Sem necessidade de RNG externo para o valor final

---

## Convenções de Código

- **Nomes de arquivo:** PascalCase para componentes, camelCase para utilitários
- **Stores:** `use[Nome]Store` com Zustand
- **Tipos:** Definidos em `src/types/` e `src/engine/types/`
- **Componentes 3D:** Usam `React.forwardRef` para expor o `THREE.Group`
- **Materiais:** Cada DiceStyle tem sua própria pasta em `engine/materials/`