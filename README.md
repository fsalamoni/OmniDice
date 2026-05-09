# 🎲 OmniDice

**Professional 3D Virtual Dice for RPG — Physics-based dice roller with OBS streaming support**

> Repositório: [github.com/fsalamoni/OmniDice](https://github.com/fsalamoni/OmniDice)

---

## 🚀 Quick Start

```bash
cd OmniDice
npm install
npm run dev
```

Acesse: **http://localhost:3000/**

---

## ✨ Features

### 🎮 3D Dice Roller
- **Física realista:** Motor Rapier3D determinístico
- **Renderização:** Three.js + React Three Fiber
- **Todos os tipos de dados:** d4, d6, d8, d10, d12, d20, d100 + **Dado Fudge** (±/0)
- **21 Skins de dados:** 10 Divine (Amethyst, Blood, Emerald, Gold, Ice, Nebula, Obsidian, Pearl, Sapphire, Void) + 10 Color (Crimson, Royal Blue, Forest, Steel, Copper, Rose Gold, Neon Pink, Neon Green, Ivory, Midnight) + Custom

### 🎨 5 Temas de Cena
| Tema | Ambiente |
|---|---|
| 🏰 Medieval Castle | Felt verde, paredes de castelo, luz âmbar |
| 💀 Dark Dungeon | Pedra escura, luz azulada, névoa |
| 🏢 Modern Lounge | Madeira clara, luz natural |
| 🚀 Cyber Station | Metal futurista, neon ciano |
| 👻 Eldritch Realm | Horror cósmico, luz púrpura |

### 📹 Virtual Camera (Streaming)
- **Modo Câmera (F2):** Esconde toda UI, mostra apenas o canvas 3D
- **Pop-Out Window:** Janela limpa para captura no OBS (Window Capture)
- **Picture-in-Picture:** PiP nativo do navegador
- **Compatível com:** OBS Studio, Discord, Zoom, VDO Ninja

### 🎯 Controles
- **F2** — Ativa/desativa modo câmera virtual
- **ESC** — Sai do modo câmera
- **Modificador:** -5 a +5
- **Histórico** de rolagens com notação

---

## 🛠️ Tech Stack

| Tecnologia | Uso |
|---|---|
| **React 18** | UI Framework |
| **TypeScript** | Linguagem |
| **Three.js** | Renderização 3D |
| **@react-three/fiber** | React wrapper para Three.js |
| **@react-three/drei** | Utilitários Three.js |
| **@react-three/rapier** | Física (Rapier) |
| **Zustand** | Gerenciamento de estado |
| **Vite** | Build tool |

---

## 📂 Estrutura do Projeto

```
OmniDice/
├── index.html              # Entry point HTML
├── package.json            # Dependências e scripts
├── tsconfig.json           # Configuração TypeScript
├── vite.config.ts          # Configuração Vite
└── src/
    ├── main.tsx            # React entry point
    ├── App.tsx             # Componente raiz
    ├── components/         # Componentes de UI
    │   ├── CameraControls/ # Controles de câmera 3D
    │   ├── ControlPanel/   # Painel de seleção de dados
    │   ├── CustomSkinCreator/ # Criador de skins customizadas
    │   ├── DiceBox/        # Container do canvas 3D
    │   ├── MaterialSelector/ # Seletor de material dos dados
    │   ├── ResultsDisplay/ # Exibição de resultados
    │   ├── RollHistory/    # Histórico de rolagens
    │   ├── ThemeSelector/  # Seletor de temas
    │   └── VirtualCamera/  # Sistema de câmera virtual
    ├── engine/             # Motor 3D
    │   ├── audio/          # Sistema de áudio
    │   ├── colliders/      # Colisores físicos
    │   ├── dice/           # Componentes de dados 3D
    │   ├── helpers/        # Utilitários (DiceThrower, random)
    │   ├── materials/      # Materiais dos dados
    │   │   ├── color/      # Skins coloridas
    │   │   ├── custom/     # Skin customizada
    │   │   ├── divine_*/   # Skins Divine (10 variantes)
    │   │   └── fudge/      # Material do dado Fudge
    │   ├── meshes/         # Modelos 3D (.glb)
    │   └── types/          # Tipos do motor
    ├── store/              # Zustand stores
    │   ├── cameraStore.ts  # Estado da câmera virtual
    │   ├── customSkinStore.ts # Estado de skins customizadas
    │   ├── diceMaterialStore.ts # Estado do material dos dados
    │   ├── diceStore.ts    # Estado principal dos dados
    │   └── themeStore.ts   # Estado dos temas
    └── types/              # Tipos TypeScript
        └── dice.types.ts   # Tipos de dados e temas
```

---

## 🔗 Repositórios GitHub

| Repositório | Status |
|---|---|
| [github.com/fsalamoni/OmniDice](https://github.com/fsalamoni/OmniDice) | ✅ Ativo — Desenvolvimento |
| [github.com/fsalamoni/OmniDice-prod](https://github.com/fsalamoni/OmniDice-prod) | 📦 Arquivado — Produção (read-only) |

---

## 📝 Scripts

```bash
npm run dev      # Servidor de desenvolvimento (porta 3000)
npm run build    # Build de produção
```

---

## 📦 Pasta `_arquivar/`

Contém projetos relacionados que foram arquivados:
- `owlbear-dice/` — Extensão oficial do Owlbear Rodeo ([github.com/owlbear-rodeo/dice](https://github.com/owlbear-rodeo/dice))
- `Protagonista Dice/` — Módulo de dados extraído de app TTRPG
- `dice-virtual-cam/` — Versão anterior do Dice Virtual Cam
- `Files Claude/` — Documentação original do projeto

---

## 📄 Licença

Este projeto é open-source. Consulte o repositório GitHub para detalhes.