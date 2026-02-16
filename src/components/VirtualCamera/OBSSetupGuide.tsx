import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;
  icon: string;
  detail?: string;
  tip?: string;
}

const steps: Step[] = [
  {
    title: '1. Abra o OBS Studio',
    description: 'Inicie o OBS Studio no seu computador.',
    icon: '🖥️',
    detail: 'Se ainda não tem o OBS instalado, baixe gratuitamente em obsproject.com',
    tip: 'O OBS pode ficar minimizado durante o jogo — ele roda em segundo plano.',
  },
  {
    title: '2. Abra a Janela de Stream',
    description: 'No OmniDice, clique no botão 📡 Stream e depois em "Abrir Janela OBS". Uma janela limpa vai abrir mostrando apenas os dados 3D.',
    icon: '📡',
    detail: 'Essa janela mostra exatamente o que será transmitido — sem painéis, botões ou interface.',
    tip: 'Se o pop-up for bloqueado, permita pop-ups para localhost:3000 no navegador.',
  },
  {
    title: '3. Capture a Janela no OBS',
    description: 'No OBS, clique em "+" em Fontes (Sources) → "Captura de Janela" (Window Capture) → Selecione a janela "OmniDice - Stream".',
    icon: '🎯',
    detail: 'A janela do OmniDice vai aparecer na lista de janelas disponíveis. Selecione-a e clique OK.',
    tip: 'Ajuste o tamanho da fonte no OBS para preencher toda a área da cena.',
  },
  {
    title: '4. Ative a Câmera Virtual do OBS',
    description: 'No OBS, clique em "Iniciar Câmera Virtual" (Start Virtual Camera) no canto inferior direito.',
    icon: '🎬',
    detail: 'Isso cria uma câmera virtual no seu sistema chamada "OBS Virtual Camera" que qualquer programa pode usar.',
    tip: 'Você pode configurar o OBS para iniciar a câmera virtual automaticamente ao abrir.',
  },
  {
    title: '5. Use no VTT (Roll20 / Owlbear)',
    description: 'No seu VTT, nas configurações de câmera, agora aparecem DUAS câmeras: sua webcam real e "OBS Virtual Camera".',
    icon: '🎲',
    detail: 'Troque entre elas a qualquer momento:\n• Webcam real → mostra seu rosto\n• OBS Virtual Camera → mostra os dados 3D',
    tip: 'A troca é instantânea! Basta selecionar a câmera desejada no VTT.',
  },
];

export const OBSSetupGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 200000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'dvc-fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: 520,
          background: 'rgba(15, 12, 10, 0.98)',
          border: '1.5px solid rgba(230, 168, 23, 0.3)',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(230, 168, 23, 0.15)',
          background: 'rgba(230, 168, 23, 0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>📋</span>
            <div>
              <div style={{
                fontFamily: "'Cinzel', serif, system-ui",
                fontSize: 16,
                fontWeight: 600,
                color: '#e6a817',
              }}>
                Guia de Configuração OBS
              </div>
              <div style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
                color: 'rgba(232, 224, 212, 0.5)',
                marginTop: 2,
              }}>
                Passo {currentStep + 1} de {steps.length}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(232, 224, 212, 0.5)',
              fontSize: 20,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#e8e0d4')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232, 224, 212, 0.5)')}
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3,
          background: 'rgba(230, 168, 23, 0.1)',
        }}>
          <div style={{
            height: '100%',
            width: `${((currentStep + 1) / steps.length) * 100}%`,
            background: 'linear-gradient(90deg, #e6a817, #f0c040)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '0 2px 2px 0',
          }} />
        </div>

        {/* Step content */}
        <div style={{ padding: '24px 24px 16px' }}>
          {/* Step icon and title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(230, 168, 23, 0.1)',
              border: '1px solid rgba(230, 168, 23, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              flexShrink: 0,
            }}>
              {step.icon}
            </div>
            <div style={{
              fontFamily: "'Cinzel', serif, system-ui",
              fontSize: 15,
              fontWeight: 600,
              color: '#e8e0d4',
              lineHeight: 1.3,
            }}>
              {step.title}
            </div>
          </div>

          {/* Description */}
          <div style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: 13,
            color: 'rgba(232, 224, 212, 0.85)',
            lineHeight: 1.6,
            marginBottom: 12,
            paddingLeft: 62,
          }}>
            {step.description}
          </div>

          {/* Detail */}
          {step.detail && (
            <div style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 12,
              color: 'rgba(232, 224, 212, 0.55)',
              lineHeight: 1.6,
              marginBottom: 12,
              paddingLeft: 62,
              whiteSpace: 'pre-line',
            }}>
              {step.detail}
            </div>
          )}

          {/* Tip */}
          {step.tip && (
            <div
              onClick={() => setExpandedTip(expandedTip === currentStep ? null : currentStep)}
              style={{
                marginLeft: 62,
                padding: '8px 12px',
                background: 'rgba(230, 168, 23, 0.06)',
                border: '1px solid rgba(230, 168, 23, 0.12)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
                color: '#e6a817',
                fontWeight: 500,
              }}>
                <span>💡</span>
                <span>Dica</span>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 10,
                  transform: expandedTip === currentStep ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>▼</span>
              </div>
              {expandedTip === currentStep && (
                <div style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontSize: 11,
                  color: 'rgba(232, 224, 212, 0.6)',
                  lineHeight: 1.5,
                  marginTop: 6,
                  paddingLeft: 20,
                }}>
                  {step.tip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step indicators (dots) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          padding: '8px 0',
        }}>
          {steps.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentStep(i)}
              style={{
                width: i === currentStep ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === currentStep
                  ? '#e6a817'
                  : i < currentStep
                    ? 'rgba(230, 168, 23, 0.4)'
                    : 'rgba(232, 224, 212, 0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 20px 16px',
          gap: 12,
        }}>
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={isFirst}
            style={{
              flex: 1,
              padding: '10px 16px',
              background: isFirst ? 'rgba(232, 224, 212, 0.05)' : 'rgba(232, 224, 212, 0.08)',
              border: `1px solid rgba(232, 224, 212, ${isFirst ? '0.05' : '0.15'})`,
              borderRadius: 10,
              color: isFirst ? 'rgba(232, 224, 212, 0.2)' : 'rgba(232, 224, 212, 0.7)',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: isFirst ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            ← Anterior
          </button>

          {isLast ? (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #e6a817, #d4941a)',
                border: 'none',
                borderRadius: 10,
                color: '#0f0a04',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(230, 168, 23, 0.3)',
              }}
            >
              Entendi! ✓
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: 'rgba(230, 168, 23, 0.15)',
                border: '1px solid rgba(230, 168, 23, 0.3)',
                borderRadius: 10,
                color: '#e6a817',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Próximo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
