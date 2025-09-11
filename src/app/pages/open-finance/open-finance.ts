import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface BankConnection {
  id: string;
  name: string;
  logo: string;
  status: 'connected' | 'disconnected' | 'pending' | 'error';
  lastSync: string;
  accounts: BankAccount[];
  features: string[];
}

interface BankAccount {
  id: string;
  type: 'checking' | 'savings' | 'credit';
  number: string;
  balance: number;
  currency: string;
}

interface SyncStatus {
  isRunning: boolean;
  lastUpdate: string;
  nextUpdate: string;
  progress: number;
}

@Component({
  selector: 'app-open-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="open-finance-container">
      <!-- Header Section -->
      <header class="page-header animate-fade-in">
        <div class="header-content">
          <div class="header-visual">
            <div class="header-icon">
              <app-icon name="credit-card" size="32" className="text-primary"></app-icon>
            </div>
          </div>
          <div class="header-text">
            <h1>Open Finance</h1>
            <p>Conecte suas contas bancárias de forma segura e tenha controle total das suas finanças em um só lugar</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-outline" (click)="refreshAllConnections()" [disabled]="syncStatus.isRunning">
              <app-icon [name]="syncStatus.isRunning ? 'arrow-path' : 'arrow-path'" size="16" [className]="syncStatus.isRunning ? 'animate-spin' : ''"></app-icon>
              <span>{{ syncStatus.isRunning ? 'Sincronizando...' : 'Sincronizar' }}</span>
            </button>
            <button class="btn btn-primary" (click)="openAddBankModal()">
              <app-icon name="plus" size="16"></app-icon>
              <span>Conectar Banco</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Sync Status Bar -->
      <div class="sync-status-bar animate-fade-in" *ngIf="syncStatus.isRunning">
        <div class="sync-content">
          <div class="sync-info">
            <app-icon name="arrow-path" size="16" className="animate-spin text-primary"></app-icon>
            <span>Sincronizando dados bancários...</span>
          </div>
          <div class="sync-progress">
            <div class="progress-bar">
              <div class="progress-fill" [style.width]="syncStatus.progress + '%'"></div>
            </div>
            <span class="progress-text">{{ syncStatus.progress }}%</span>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <section class="quick-stats animate-fade-in">
        <div class="stats-grid">
          <div class="stat-card highlight">
            <div class="stat-icon">
              <app-icon name="banknotes" size="24" className="text-success"></app-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">Saldo Total</div>
              <div class="stat-value">{{ formatCurrency(getTotalBalance()) }}</div>
              <div class="stat-change positive">+{{ getBalanceChange() }}% este mês</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <app-icon name="credit-card" size="24" className="text-blue"></app-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">Contas Conectadas</div>
              <div class="stat-value">{{ getConnectedAccountsCount() }}</div>
              <div class="stat-change neutral">{{ getConnectedBanksCount() }} bancos</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <app-icon name="arrow-path" size="24" className="text-warning"></app-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">Última Atualização</div>
              <div class="stat-value text-sm">{{ getLastSyncTime() }}</div>
              <div class="stat-change neutral">Automática</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <app-icon name="chart-bar" size="24" className="text-purple"></app-icon>
            </div>
            <div class="stat-content">
              <div class="stat-label">Transações Hoje</div>
              <div class="stat-value">{{ getTodayTransactionsCount() }}</div>
              <div class="stat-change positive">{{ getNewTransactionsCount() }} novas</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Bank Connections Grid -->
      <section class="bank-connections animate-fade-in">
        <div class="section-header">
          <h2>
            <app-icon name="building-office" size="24" className="text-primary"></app-icon>
            <span>Suas Conexões Bancárias</span>
          </h2>
          <div class="connection-summary">
            <span class="summary-item success">{{ getConnectedBanksCount() }} conectados</span>
            <span class="summary-item warning" *ngIf="getPendingBanksCount() > 0">{{ getPendingBanksCount() }} pendentes</span>
            <span class="summary-item error" *ngIf="getErrorBanksCount() > 0">{{ getErrorBanksCount() }} com erro</span>
          </div>
        </div>

        <div class="banks-grid">
          <div class="bank-card" 
               *ngFor="let bank of bankConnections" 
               [class]="'status-' + bank.status"
               (click)="openBankDetails(bank)">
            <div class="bank-header">
              <div class="bank-logo-container">
                <img [src]="bank.logo" [alt]="bank.name" class="bank-logo" onerror="this.style.display='none'">
                <div class="bank-logo-fallback" *ngIf="!bank.logo">
                  <app-icon name="building-office" size="24"></app-icon>
                </div>
                <div class="status-indicator" [class]="bank.status">
                  <app-icon 
                    [name]="getStatusIcon(bank.status)" 
                    size="12" 
                    [className]="getStatusIconClass(bank.status)">
                  </app-icon>
                </div>
              </div>
              <div class="bank-actions">
                <button class="action-btn" (click)="toggleBankMenu(bank.id); $event.stopPropagation()">
                  <app-icon name="ellipsis-vertical" size="16"></app-icon>
                </button>
                <div class="bank-menu" *ngIf="activeBankMenu === bank.id" (click)="$event.stopPropagation()">
                  <button class="menu-item" (click)="syncBank(bank)" [disabled]="syncStatus.isRunning">
                    <app-icon name="arrow-path" size="14"></app-icon>
                    <span>Sincronizar</span>
                  </button>
                  <button class="menu-item" (click)="configureBankSync(bank)">
                    <app-icon name="cog-6-tooth" size="14"></app-icon>
                    <span>Configurar</span>
                  </button>
                  <button class="menu-item danger" (click)="disconnectBank(bank)">
                    <app-icon name="x-mark" size="14"></app-icon>
                    <span>Desconectar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="bank-info">
              <h3 class="bank-name">{{ bank.name }}</h3>
              <div class="bank-status">
                <span class="status-text" [class]="bank.status">{{ getStatusText(bank.status) }}</span>
                <span class="status-time">{{ getFormattedTime(bank.lastSync) }}</span>
              </div>
            </div>

            <div class="bank-accounts" *ngIf="bank.accounts.length > 0">
              <div class="accounts-header">
                <span class="accounts-count">{{ bank.accounts.length }} conta(s)</span>
                <span class="accounts-balance">{{ formatCurrency(getBankTotalBalance(bank)) }}</span>
              </div>
              <div class="accounts-list">
                <div class="account-item" *ngFor="let account of bank.accounts">
                  <div class="account-info">
                    <div class="account-type">
                      <app-icon [name]="getAccountTypeIcon(account.type)" size="16" [className]="getAccountTypeClass(account.type)"></app-icon>
                      <span>{{ getAccountTypeName(account.type) }}</span>
                    </div>
                    <div class="account-number">{{ maskAccountNumber(account.number) }}</div>
                  </div>
                  <div class="account-balance" [class]="account.balance >= 0 ? 'positive' : 'negative'">
                    {{ formatCurrency(account.balance) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="bank-features" *ngIf="bank.features.length > 0">
              <div class="features-list">
                <span class="feature-tag" *ngFor="let feature of bank.features">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Add New Bank Card -->
          <div class="bank-card add-bank-card" (click)="openAddBankModal()">
            <div class="add-bank-content">
              <div class="add-bank-icon">
                <app-icon name="plus" size="32" className="text-primary"></app-icon>
              </div>
              <h3>Conectar Novo Banco</h3>
              <p>Adicione mais instituições financeiras para uma visão completa</p>
              <div class="supported-banks">
                <span class="supported-count">{{ getSupportedBanksCount() }}+ bancos suportados</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Available Banks -->
      <section class="available-banks animate-fade-in" *ngIf="showAvailableBanks">
        <div class="section-header">
          <h2>
            <app-icon name="building-office" size="24" className="text-primary"></app-icon>
            <span>Bancos Disponíveis</span>
          </h2>
          <button class="btn btn-ghost" (click)="toggleAvailableBanks()">
            <app-icon name="eye-slash" size="16"></app-icon>
            <span>Ocultar</span>
          </button>
        </div>

        <div class="available-banks-grid">
          <div class="available-bank" 
               *ngFor="let bank of availableBanks" 
               (click)="connectBank(bank)"
               [class.connected]="isBankConnected(bank.id)">
            <div class="available-bank-logo">
              <img [src]="bank.logo" [alt]="bank.name" class="bank-logo">
            </div>
            <div class="available-bank-info">
              <h4>{{ bank.name }}</h4>
              <div class="bank-features-count">{{ bank.features.length }} recursos</div>
            </div>
            <div class="available-bank-action">
              <app-icon 
                [name]="isBankConnected(bank.id) ? 'check' : 'plus'" 
                size="16" 
                [className]="isBankConnected(bank.id) ? 'text-success' : 'text-primary'">
              </app-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- Security & Compliance -->
      <section class="security-section animate-fade-in">
        <div class="security-card">
          <div class="security-header">
            <div class="security-icon">
              <app-icon name="shield-check" size="32" className="text-success"></app-icon>
            </div>
            <div class="security-content">
              <h2>Segurança & Conformidade</h2>
              <p>Seus dados estão protegidos pelos mais altos padrões de segurança bancária</p>
            </div>
          </div>
          
          <div class="security-grid">
            <div class="security-item">
              <div class="security-item-icon">
                <app-icon name="lock-closed" size="20" className="text-success"></app-icon>
              </div>
              <div class="security-item-content">
                <h4>Criptografia de Ponta a Ponta</h4>
                <p>Todos os dados são criptografados com AES-256</p>
              </div>
            </div>

            <div class="security-item">
              <div class="security-item-icon">
                <app-icon name="shield-exclamation" size="20" className="text-success"></app-icon>
              </div>
              <div class="security-item-content">
                <h4>Certificação Banco Central</h4>
                <p>Credenciamento oficial BACEN nº 1234567890</p>
              </div>
            </div>

            <div class="security-item">
              <div class="security-item-icon">
                <app-icon name="eye-slash" size="20" className="text-success"></app-icon>
              </div>
              <div class="security-item-content">
                <h4>Acesso Somente Leitura</h4>
                <p>Nunca movimentamos ou alteramos seus dados</p>
              </div>
            </div>

            <div class="security-item">
              <div class="security-item-icon">
                <app-icon name="clock" size="20" className="text-success"></app-icon>
              </div>
              <div class="security-item-content">
                <h4>Consentimento Temporário</h4>
                <p>Controle total sobre quando e por quanto tempo</p>
              </div>
            </div>
          </div>
          
          <div class="compliance-badges">
            <div class="compliance-badge">
              <span class="badge-text">LGPD</span>
              <span class="badge-desc">Conformidade</span>
            </div>
            <div class="compliance-badge">
              <span class="badge-text">PCI DSS</span>
              <span class="badge-desc">Certificado</span>
            </div>
            <div class="compliance-badge">
              <span class="badge-text">ISO 27001</span>
              <span class="badge-desc">Auditado</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrl: './open-finance.scss'
})
export class OpenFinanceComponent implements OnInit {
  bankConnections: BankConnection[] = [];
  availableBanks: BankConnection[] = [];
  syncStatus: SyncStatus = {
    isRunning: false,
    lastUpdate: new Date().toISOString(),
    nextUpdate: '',
    progress: 0
  };
  showAvailableBanks = false;
  activeBankMenu: string | null = null;

  ngOnInit() {
    this.initializeBankConnections();
    this.initializeAvailableBanks();
  }

  private initializeBankConnections(): void {
    this.bankConnections = [
      {
        id: 'bb-001',
        name: 'Banco do Brasil',
        logo: '/banco-do-brasil.svg',
        status: 'connected',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
        accounts: [
          {
            id: 'bb-cc-001',
            type: 'checking',
            number: '12345-6',
            balance: 8547.32,
            currency: 'BRL'
          },
          {
            id: 'bb-sv-001',
            type: 'savings',
            number: '12345-0',
            balance: 15420.89,
            currency: 'BRL'
          }
        ],
        features: ['Conta Corrente', 'Poupança', 'Cartão de Crédito']
      },
      {
        id: 'itau-001',
        name: 'Itaú Unibanco',
        logo: '/itau.svg',
        status: 'pending',
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        accounts: [
          {
            id: 'itau-cc-001',
            type: 'checking',
            number: '98765-4',
            balance: 2847.65,
            currency: 'BRL'
          }
        ],
        features: ['Conta Corrente', 'Investimentos']
      },
      {
        id: 'nubank-001',
        name: 'Nubank',
        logo: '/nubank.svg',
        status: 'connected',
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
        accounts: [
          {
            id: 'nu-cc-001',
            type: 'credit',
            number: '5555-****-****-1234',
            balance: -1247.85,
            currency: 'BRL'
          }
        ],
        features: ['Cartão de Crédito', 'Conta Digital']
      }
    ];
  }

  private initializeAvailableBanks(): void {
    this.availableBanks = [
      {
        id: 'santander-001',
        name: 'Santander',
        logo: '/santander.svg',
        status: 'disconnected',
        lastSync: '',
        accounts: [],
        features: ['Conta Corrente', 'Cartão de Crédito', 'Investimentos', 'Financiamentos']
      },
      {
        id: 'bradesco-001',
        name: 'Bradesco',
        logo: '/bradesco.svg',
        status: 'disconnected',
        lastSync: '',
        accounts: [],
        features: ['Conta Corrente', 'Poupança', 'Cartão de Crédito']
      },
      {
        id: 'caixa-001',
        name: 'Caixa Econômica',
        logo: '/caixa.svg',
        status: 'disconnected',
        lastSync: '',
        accounts: [],
        features: ['Conta Corrente', 'Poupança', 'FGTS']
      },
      {
        id: 'inter-001',
        name: 'Banco Inter',
        logo: '/inter.svg',
        status: 'disconnected',
        lastSync: '',
        accounts: [],
        features: ['Conta Digital', 'Investimentos', 'Cartão']
      }
    ];
  }

  // Utility Methods
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getTotalBalance(): number {
    return this.bankConnections
      .filter(bank => bank.status === 'connected')
      .reduce((total, bank) => {
        return total + bank.accounts.reduce((bankTotal, account) => {
          return bankTotal + (account.type !== 'credit' ? account.balance : 0);
        }, 0);
      }, 0);
  }

  getBalanceChange(): number {
    return 2.5; // Mock data
  }

  getConnectedAccountsCount(): number {
    return this.bankConnections
      .filter(bank => bank.status === 'connected')
      .reduce((count, bank) => count + bank.accounts.length, 0);
  }

  getConnectedBanksCount(): number {
    return this.bankConnections.filter(bank => bank.status === 'connected').length;
  }

  getPendingBanksCount(): number {
    return this.bankConnections.filter(bank => bank.status === 'pending').length;
  }

  getErrorBanksCount(): number {
    return this.bankConnections.filter(bank => bank.status === 'error').length;
  }

  getLastSyncTime(): string {
    const latestSync = this.bankConnections
      .filter(bank => bank.lastSync)
      .map(bank => new Date(bank.lastSync))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    
    if (!latestSync) return 'Nunca';
    
    const now = new Date();
    const diffMs = now.getTime() - latestSync.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins}m atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  }

  getTodayTransactionsCount(): number {
    return 7; // Mock data
  }

  getNewTransactionsCount(): number {
    return 3; // Mock data
  }

  getSupportedBanksCount(): number {
    return this.bankConnections.length + this.availableBanks.length;
  }

  getBankTotalBalance(bank: BankConnection): number {
    return bank.accounts.reduce((total, account) => {
      return total + (account.type !== 'credit' ? account.balance : 0);
    }, 0);
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'connected': return 'check-circle';
      case 'pending': return 'clock';
      case 'error': return 'exclamation-triangle';
      default: return 'x-circle';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'connected': return 'text-success';
      case 'pending': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'pending': return 'Aguardando autorização';
      case 'error': return 'Erro na conexão';
      default: return 'Desconectado';
    }
  }

  getFormattedTime(isoString: string): string {
    if (!isoString) return '';
    
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  }

  getAccountTypeIcon(type: string): string {
    switch (type) {
      case 'checking': return 'banknotes';
      case 'savings': return 'currency-dollar';
      case 'credit': return 'credit-card';
      default: return 'building-office';
    }
  }

  getAccountTypeClass(type: string): string {
    switch (type) {
      case 'checking': return 'text-blue';
      case 'savings': return 'text-green';
      case 'credit': return 'text-orange';
      default: return 'text-secondary';
    }
  }

  getAccountTypeName(type: string): string {
    switch (type) {
      case 'checking': return 'Conta Corrente';
      case 'savings': return 'Poupança';
      case 'credit': return 'Cartão de Crédito';
      default: return 'Conta';
    }
  }

  maskAccountNumber(number: string): string {
    if (number.includes('*')) return number;
    return number.replace(/(\d{4})(\d+)(\d{4})/, '$1****$3');
  }

  isBankConnected(bankId: string): boolean {
    return this.bankConnections.some(bank => bank.id === bankId && bank.status === 'connected');
  }

  // Action Methods
  refreshAllConnections(): void {
    this.syncStatus.isRunning = true;
    this.syncStatus.progress = 0;
    
    const interval = setInterval(() => {
      this.syncStatus.progress += 10;
      if (this.syncStatus.progress >= 100) {
        clearInterval(interval);
        this.syncStatus.isRunning = false;
        this.syncStatus.lastUpdate = new Date().toISOString();
        
        // Update last sync for all connected banks
        this.bankConnections.forEach(bank => {
          if (bank.status === 'connected') {
            bank.lastSync = new Date().toISOString();
          }
        });
      }
    }, 200);
  }

  openAddBankModal(): void {
    this.showAvailableBanks = true;
    // In a real app, this would open a modal
    console.log('Opening add bank modal...');
  }

  toggleAvailableBanks(): void {
    this.showAvailableBanks = !this.showAvailableBanks;
  }

  connectBank(bank: BankConnection): void {
    if (this.isBankConnected(bank.id)) return;
    
    // Simulate connection process
    console.log(`Connecting to ${bank.name}...`);
    
    // Add to connected banks with pending status
    const newConnection = {
      ...bank,
      status: 'pending' as const,
      lastSync: new Date().toISOString()
    };
    
    this.bankConnections.push(newConnection);
    
    // Simulate authorization process
    setTimeout(() => {
      const bankIndex = this.bankConnections.findIndex(b => b.id === bank.id);
      if (bankIndex >= 0) {
        this.bankConnections[bankIndex].status = 'connected';
        this.bankConnections[bankIndex].lastSync = new Date().toISOString();
      }
    }, 3000);
  }

  openBankDetails(bank: BankConnection): void {
    console.log('Opening bank details for:', bank.name);
    // In a real app, this would open a detailed view
  }

  toggleBankMenu(bankId: string): void {
    this.activeBankMenu = this.activeBankMenu === bankId ? null : bankId;
  }

  syncBank(bank: BankConnection): void {
    this.activeBankMenu = null;
    console.log(`Syncing ${bank.name}...`);
    
    bank.lastSync = new Date().toISOString();
    
    // Simulate sync process
    setTimeout(() => {
      console.log(`${bank.name} synced successfully`);
    }, 2000);
  }

  configureBankSync(bank: BankConnection): void {
    this.activeBankMenu = null;
    console.log(`Configuring sync for ${bank.name}...`);
    // In a real app, this would open configuration modal
  }

  disconnectBank(bank: BankConnection): void {
    this.activeBankMenu = null;
    
    if (confirm(`Tem certeza que deseja desconectar ${bank.name}?`)) {
      const index = this.bankConnections.findIndex(b => b.id === bank.id);
      if (index >= 0) {
        this.bankConnections.splice(index, 1);
      }
    }
  }
}
