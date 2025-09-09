import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  id: string;
  title: string;
  subtitle?: string;
  message?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'fullscreen';
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  icon?: string;
  closable?: boolean;
  showFooter?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  data?: any;
}

export interface ModalResult {
  action: 'confirm' | 'cancel' | 'close';
  data?: any;
}

interface ActiveModal extends ModalConfig {
  isOpen: boolean;
  resolve?: (result: ModalResult) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals = new BehaviorSubject<ActiveModal[]>([]);
  public modals$ = this.modals.asObservable();
  
  constructor() {}
  
  /**
   * Open a custom modal
   */
  open(config: ModalConfig): Promise<ModalResult> {
    return new Promise((resolve) => {
      const modal: ActiveModal = {
        ...config,
        isOpen: true,
        resolve
      };
      
      const currentModals = this.modals.value;
      this.modals.next([...currentModals, modal]);
    });
  }
  
  /**
   * Show confirmation dialog
   */
  confirm(
    title: string, 
    message: string, 
    options: Partial<ModalConfig> = {}
  ): Promise<ModalResult> {
    const config: ModalConfig = {
      id: this.generateId(),
      title,
      message,
      type: 'confirm',
      size: 'small',
      icon: 'question-mark-circle',
      showFooter: true,
      confirmLabel: 'Confirmar',
      cancelLabel: 'Cancelar',
      ...options
    };
    
    return this.open(config);
  }
  
  /**
   * Show success modal
   */
  success(
    title: string, 
    message: string, 
    options: Partial<ModalConfig> = {}
  ): Promise<ModalResult> {
    const config: ModalConfig = {
      id: this.generateId(),
      title,
      message,
      type: 'success',
      size: 'small',
      icon: 'check-circle',
      showFooter: true,
      confirmLabel: 'OK',
      cancelLabel: '',
      ...options
    };
    
    return this.open(config);
  }
  
  /**
   * Show error modal
   */
  error(
    title: string, 
    message: string, 
    options: Partial<ModalConfig> = {}
  ): Promise<ModalResult> {
    const config: ModalConfig = {
      id: this.generateId(),
      title,
      message,
      type: 'error',
      size: 'small',
      icon: 'exclamation-triangle',
      showFooter: true,
      confirmLabel: 'OK',
      cancelLabel: '',
      ...options
    };
    
    return this.open(config);
  }
  
  /**
   * Show warning modal
   */
  warning(
    title: string, 
    message: string, 
    options: Partial<ModalConfig> = {}
  ): Promise<ModalResult> {
    const config: ModalConfig = {
      id: this.generateId(),
      title,
      message,
      type: 'warning',
      size: 'small',
      icon: 'exclamation-triangle',
      showFooter: true,
      confirmLabel: 'OK',
      cancelLabel: '',
      ...options
    };
    
    return this.open(config);
  }
  
  /**
   * Show info modal
   */
  info(
    title: string, 
    message: string, 
    options: Partial<ModalConfig> = {}
  ): Promise<ModalResult> {
    const config: ModalConfig = {
      id: this.generateId(),
      title,
      message,
      type: 'info',
      size: 'small',
      icon: 'information-circle',
      showFooter: true,
      confirmLabel: 'OK',
      cancelLabel: '',
      ...options
    };
    
    return this.open(config);
  }
  
  /**
   * Close modal by ID
   */
  close(modalId: string, result: ModalResult = { action: 'close' }): void {
    const currentModals = this.modals.value;
    const modalIndex = currentModals.findIndex(m => m.id === modalId);
    
    if (modalIndex > -1) {
      const modal = currentModals[modalIndex];
      if (modal.resolve) {
        modal.resolve(result);
      }
      
      currentModals.splice(modalIndex, 1);
      this.modals.next([...currentModals]);
    }
  }
  
  /**
   * Close all modals
   */
  closeAll(): void {
    const currentModals = this.modals.value;
    currentModals.forEach(modal => {
      if (modal.resolve) {
        modal.resolve({ action: 'close' });
      }
    });
    this.modals.next([]);
  }
  
  /**
   * Get modal by ID
   */
  getModal(modalId: string): ActiveModal | undefined {
    return this.modals.value.find(m => m.id === modalId);
  }
  
  /**
   * Check if any modal is open
   */
  hasOpenModals(): boolean {
    return this.modals.value.length > 0;
  }
  
  /**
   * Get currently active (top) modal
   */
  getActiveModal(): ActiveModal | undefined {
    const modals = this.modals.value;
    return modals.length > 0 ? modals[modals.length - 1] : undefined;
  }
  
  /**
   * Open modal by type (método específico para o dashboard)
   */
  openModal(type: string, config: any): Promise<ModalResult> {
    const modalId = this.generateId();
    
    switch (type) {
      case 'transaction':
        return this.openTransactionModal(modalId, config);
      case 'goal':
        return this.openGoalModal(modalId, config);
      case 'premium':
        return this.openPremiumModal(modalId, config);
      default:
        return this.open({
          id: modalId,
          title: config.title || 'Modal',
          message: config.message,
          size: config.size || 'medium',
          ...config
        });
    }
  }
  
  private openTransactionModal(id: string, config: any): Promise<ModalResult> {
    const modalConfig: ModalConfig = {
      id,
      title: config.title || 'Nova Transação',
      size: 'large',
      type: 'info',
      showFooter: true,
      confirmLabel: 'Salvar Transação',
      cancelLabel: 'Cancelar',
      data: {
        type: 'transaction',
        mode: config.mode || 'create',
        fields: [
          {
            name: 'type',
            label: 'Tipo',
            type: 'select',
            required: true,
            options: [
              { value: 'income', label: 'Receita' },
              { value: 'expense', label: 'Despesa' }
            ]
          },
          {
            name: 'amount',
            label: 'Valor',
            type: 'number',
            required: true,
            min: 0.01,
            step: 0.01,
            placeholder: '0,00'
          },
          {
            name: 'description',
            label: 'Descrição',
            type: 'text',
            required: true,
            placeholder: 'Ex: Salário, Compras no mercado...'
          },
          {
            name: 'category',
            label: 'Categoria',
            type: 'select',
            required: true,
            options: [
              { value: 'salary', label: 'Salário' },
              { value: 'freelance', label: 'Freelance' },
              { value: 'investment', label: 'Investimento' },
              { value: 'food', label: 'Alimentação' },
              { value: 'transport', label: 'Transporte' },
              { value: 'health', label: 'Saúde' },
              { value: 'education', label: 'Educação' },
              { value: 'entertainment', label: 'Entretenimento' },
              { value: 'shopping', label: 'Compras' },
              { value: 'bills', label: 'Contas' },
              { value: 'other', label: 'Outros' }
            ]
          },
          {
            name: 'date',
            label: 'Data',
            type: 'date',
            required: true,
            value: new Date().toISOString().split('T')[0]
          },
          {
            name: 'origin',
            label: 'Contexto',
            type: 'select',
            required: true,
            options: [
              { value: 'personal', label: 'Pessoal' },
              { value: 'business', label: 'Negócio' }
            ]
          },
          {
            name: 'paymentMethod',
            label: 'Método de Pagamento',
            type: 'select',
            required: false,
            options: [
              { value: 'cash', label: 'Dinheiro' },
              { value: 'credit-card', label: 'Cartão de Crédito' },
              { value: 'debit-card', label: 'Cartão de Débito' },
              { value: 'pix', label: 'PIX' },
              { value: 'bank-transfer', label: 'Transferência Bancária' },
              { value: 'check', label: 'Cheque' }
            ]
          }
        ],
        onConfirm: config.onConfirm
      }
    };
    
    return this.open(modalConfig);
  }
  
  private openGoalModal(id: string, config: any): Promise<ModalResult> {
    const modalConfig: ModalConfig = {
      id,
      title: config.title || 'Nova Meta Financeira',
      size: 'large',
      type: 'info',
      showFooter: true,
      confirmLabel: 'Criar Meta',
      cancelLabel: 'Cancelar',
      data: {
        type: 'goal',
        mode: config.mode || 'create',
        fields: [
          {
            name: 'title',
            label: 'Nome da Meta',
            type: 'text',
            required: true,
            placeholder: 'Ex: Casa própria, Viagem dos sonhos...'
          },
          {
            name: 'description',
            label: 'Descrição',
            type: 'textarea',
            required: false,
            placeholder: 'Descreva sua meta em detalhes...'
          },
          {
            name: 'targetAmount',
            label: 'Valor da Meta',
            type: 'number',
            required: true,
            min: 1,
            step: 0.01,
            placeholder: '50000,00'
          },
          {
            name: 'deadline',
            label: 'Prazo Final',
            type: 'date',
            required: true,
            min: new Date().toISOString().split('T')[0]
          },
          {
            name: 'category',
            label: 'Categoria',
            type: 'select',
            required: true,
            options: [
              { value: 'home', label: 'Casa/Imóvel' },
              { value: 'travel', label: 'Viagem' },
              { value: 'education', label: 'Educação' },
              { value: 'vehicle', label: 'Veículo' },
              { value: 'emergency', label: 'Emergência' },
              { value: 'investment', label: 'Investimento' },
              { value: 'business', label: 'Negócio' },
              { value: 'health', label: 'Saúde' },
              { value: 'family', label: 'Família' },
              { value: 'other', label: 'Outros' }
            ]
          },
          {
            name: 'priority',
            label: 'Prioridade',
            type: 'select',
            required: true,
            options: [
              { value: 'low', label: 'Baixa' },
              { value: 'medium', label: 'Média' },
              { value: 'high', label: 'Alta' }
            ],
            value: 'medium'
          }
        ],
        onConfirm: config.onConfirm
      }
    };
    
    return this.open(modalConfig);
  }
  
  private openPremiumModal(id: string, config: any): Promise<ModalResult> {
    const modalConfig: ModalConfig = {
      id,
      title: config.title || 'Upgrade para Premium',
      subtitle: config.subtitle || 'Desbloqueie recursos avançados',
      size: 'large',
      type: 'info',
      showFooter: true,
      confirmLabel: 'Assinar Agora',
      cancelLabel: 'Talvez depois',
      data: {
        type: 'premium',
        features: config.features || [],
        plans: config.plans || [],
        onConfirm: config.onConfirm
      }
    };
    
    return this.open(modalConfig);
  }
  
  private generateId(): string {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}