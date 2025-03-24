import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Button, Dialog, HorizontalLayout, Icon } from '@vaadin/react-components';

// Tipos de dialogs
type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

// Interface para o contexto de dialogs
interface DialogContextType {
  showDialog: (message: string, options?: DialogOptions) => void;
  showConfirm: (message: string, onConfirm: () => void, options?: DialogOptions) => void;
  closeDialog: () => void;
}

// Opções para customização de dialogs
interface DialogOptions {
  title?: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  width?: string;
  onClose?: () => void;
}

// Propriedades do provider
interface DialogProviderProps {
  children: ReactNode;
}

// Estado interno do dialog
interface DialogState {
  open: boolean;
  message: string;
  title: string;
  type: DialogType;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  width: string;
  onClose: (() => void) | null;
}

// Criar o contexto
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Provider que encapsula toda a lógica de dialogs
export function DialogProvider({ children }: DialogProviderProps) {
  const [state, setState] = useState<DialogState>({
    open: false,
    message: '',
    title: 'Aviso',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancelar',
    onConfirm: null,
    width: '400px',
    onClose: null,
  });

  // Obter ícone com base no tipo
  const getIcon = () => {
    switch (state.type) {
      case 'success': return 'vaadin:check-circle';
      case 'warning': return 'vaadin:exclamation-circle';
      case 'error': return 'vaadin:close-circle';
      case 'confirm': return 'vaadin:question-circle';
      default: return 'vaadin:info-circle';
    }
  };

  // Obter cor do tema com base no tipo
  const getTheme = () => {
    switch (state.type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'confirm': return 'primary';
      default: return 'primary';
    }
  };

  // Método para fechar o dialog
  const closeDialog = () => {
    setState(prev => ({ ...prev, open: false }));
    if (state.onClose) {
      state.onClose();
    }
  };

  // Método para mostrar um dialog informativo
  const showDialog = (message: string, options?: DialogOptions) => {
    setState({
      open: true,
      message,
      title: options?.title || 'Aviso',
      type: options?.type || 'info',
      confirmText: options?.confirmText || 'OK',
      cancelText: options?.cancelText || 'Cancelar',
      onConfirm: null,
      width: options?.width || '400px',
      onClose: options?.onClose || null,
    });
  };

  // Método para mostrar um dialog de confirmação
  const showConfirm = (message: string, onConfirm: () => void, options?: DialogOptions) => {
    console.log('showConfirm chamado com:', { message, onConfirm, options });
    setState({
      open: true,
      message,
      title: options?.title || 'Confirmação',
      type: 'confirm',
      confirmText: options?.confirmText || 'Confirmar',
      cancelText: options?.cancelText || 'Cancelar',
      onConfirm,
      width: options?.width || '400px',
      onClose: options?.onClose || null,
    });
  };

  return (
    <DialogContext.Provider value={{ showDialog, showConfirm, closeDialog }}>
      {children}

      <Dialog
        headerTitle={state.title}
        opened={state.open}
        onOpenedChanged={({ detail }) => !detail.value && closeDialog()}
      >
        <div style={{ width: state.width }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '16px' 
          }}>
            <Icon 
              icon={getIcon()} 
              style={{ 
                fontSize: '24px', 
                color: state.type === 'info' ? 'var(--lumo-primary-color)' : 
                      state.type === 'success' ? 'var(--lumo-success-color)' : 
                      state.type === 'warning' ? 'var(--lumo-warning-color)' : 
                      state.type === 'error' ? 'var(--lumo-error-color)' : 
                      'var(--lumo-primary-color)'
              }} 
            />
            <div>{state.message}</div>
          </div>
        </div>

        <div slot="footer">
          <HorizontalLayout theme="spacing" style={{ justifyContent: 'flex-end' }}>
            {state.type === 'confirm' ? (
              <>
                <Button onClick={closeDialog}>
                  {state.cancelText}
                </Button>
                <Button 
                  theme="primary" 
                  onClick={() => {
                    if (state.onConfirm) {
                      state.onConfirm();
                    }
                    closeDialog();
                  }}
                >
                  {state.confirmText}
                </Button>
              </>
            ) : (
              <Button 
                theme={`primary ${getTheme()}`} 
                onClick={closeDialog}
              >
                {state.confirmText}
              </Button>
            )}
          </HorizontalLayout>
        </div>
      </Dialog>
    </DialogContext.Provider>
  );
}

// Hook para usar dialogs em qualquer componente
export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog deve ser usado dentro de um DialogProvider');
  }
  return context;
} 