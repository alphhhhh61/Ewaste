import { useState, useEffect } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { getWalletData, requestWithdrawal } from '../services/api.js';
import './Wallet.css';

const Wallet = () => {
  const [walletData, setWalletData] = useState({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Withdrawal Modal State
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('UPI');
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);


  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const userInfoStr = localStorage.getItem('userInfo');
      const { token } = JSON.parse(userInfoStr);
      const data = await getWalletData(token);
      
      setWalletData({
        balance: data.balance,
        transactions: data.transactions
      });
      setLoading(false);
      
    } catch {
      setError('Failed to load wallet data');
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWalletData();
  }, []);

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    setWithdrawError('');
    
    if (Number(withdrawAmount) < 500) {
      setWithdrawError('Minimum withdrawal amount is ₹500');
      return;
    }
    
    if (Number(withdrawAmount) > walletData.balance) {
      setWithdrawError('Insufficient balance');
      return;
    }

    setWithdrawLoading(true);

    try {
      const userInfoStr = localStorage.getItem('userInfo');
      const { token } = JSON.parse(userInfoStr);
      const data = await requestWithdrawal({ amount: Number(withdrawAmount), withdrawalMethod: withdrawMethod }, token);

      setWithdrawLoading(false);
      setWithdrawSuccess(true);
      
      setWalletData(prev => ({
        balance: data.newBalance,
        transactions: [data.transaction, ...prev.transactions]
      }));

      setTimeout(() => {
        setShowModal(false);
        setWithdrawSuccess(false);
        setWithdrawAmount('');
      }, 2000);
      
    } catch {
      setWithdrawError('Withdrawal request failed');
      setWithdrawLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your green wealth...</p>
      </div>
    );
  }

  return (
    <div className="wallet-page container section">
      
      <div className="wallet-header">
        <div>
          <h2>My Wallet</h2>
          <p className="text-secondary">Manage your recycling rewards and withdrawals.</p>
        </div>
      </div>

      {error && <div className="form-alert danger-bg"><AlertCircle size={20} /> {error}</div>}

      <div className="wallet-grid">
        
        {/* Left Column: Balance Card */}
        <div className="wallet-sidebar">
          <div className="balance-card glass">
            <div className="balance-bg-effect"></div>
            <div className="balance-content">
              <span className="balance-label">Available Balance</span>
              <h1 className="balance-amount">₹ {walletData.balance.toLocaleString()}</h1>
              
              <div className="balance-info">
                <div className="info-item">
                  <span className="info-label">Lifetime Earned</span>
                  <span className="info-value">₹ {(walletData.balance + 500).toLocaleString()}</span>
                </div>
                <div className="divider-vertical"></div>
                <div className="info-item">
                  <span className="info-label">Total Withdrawn</span>
                  <span className="info-value">₹ 500</span>
                </div>
              </div>

              <button 
                className="btn btn-primary w-100 withdraw-trigger-btn"
                onClick={() => setShowModal(true)}
                disabled={walletData.balance < 500}
              >
                Withdraw Funds
              </button>
              
              {walletData.balance < 500 && (
                <p className="min-withdraw-note">
                  <AlertCircle size={14} /> Minimum withdrawal threshold is ₹500.
                </p>
              )}
            </div>
          </div>
          
          <div className="wallet-promo glass">
            <div className="promo-icon"><WalletIcon size={24} /></div>
            <h4>Eco-Multiplier Active!</h4>
            <p>You are earning 10% extra on all CRT Monitors this month.</p>
          </div>
        </div>

        {/* Right Column: Transaction History */}
        <div className="transactions-container glass">
          <h3 className="section-title">Transaction History</h3>
          
          {walletData.transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Start recycling to earn rewards!</p>
            </div>
          ) : (
            <div className="transaction-list">
              {walletData.transactions.map((txn) => (
                <div key={txn._id} className="transaction-item">
                  <div className={`txn-icon ${txn.type === 'Credit' ? 'icon-credit' : 'icon-debit'}`}>
                    {txn.type === 'Credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  
                  <div className="txn-details">
                    <h4>{txn.description}</h4>
                    <span className="txn-date">{formatDate(txn.createdAt)}</span>
                  </div>
                  
                  <div className="txn-amounts">
                    <span className={`txn-value ${txn.type === 'Credit' ? 'text-success' : ''}`}>
                      {txn.type === 'Credit' ? '+' : '-'} ₹{txn.amount}
                    </span>
                    <span className={`txn-status status-${txn.status.toLowerCase()}`}>
                      {txn.status === 'Pending' && <Clock size={12} className="meta-icon" />}
                      {txn.status === 'Completed' && <CheckCircle2 size={12} className="meta-icon" />}
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdrawal Modal Overlay */}
      {showModal && (
        <div className="modal-overlay animate-fade-in" onClick={(e) => {
          if (e.target.className.includes('modal-overlay')) setShowModal(false);
        }}>
          <div className="modal-content glass">
            
            {withdrawSuccess ? (
              <div className="modal-success">
                <CheckCircle2 size={64} className="text-success mb-3" />
                <h3>Request Sent!</h3>
                <p>Your withdrawal of ₹{withdrawAmount} has been queued for processing.</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h3>Withdraw Funds</h3>
                  <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                </div>

                <div className="modal-body">
                  <div className="available-indicator">
                    Available: <strong>₹{walletData.balance}</strong>
                  </div>

                  {withdrawError && <div className="form-alert danger-bg"><AlertCircle size={16} /> {withdrawError}</div>}

                  <form onSubmit={handleWithdrawal}>
                    <div className="form-group mb-4">
                      <label>Amount (₹)</label>
                      <input 
                        type="number" 
                        className="fancy-input text-xl text-center"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        min="500"
                        max={walletData.balance}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="form-group mb-4">
                      <label>Transfer Method</label>
                      <div className="payment-methods">
                        <div 
                          className={`method-card ${withdrawMethod === 'UPI' ? 'active' : ''}`}
                          onClick={() => setWithdrawMethod('UPI')}
                        >
                          <Smartphone size={24} />
                          <span>UPI</span>
                        </div>
                        <div 
                          className={`method-card ${withdrawMethod === 'Bank Transfer' ? 'active' : ''}`}
                          onClick={() => setWithdrawMethod('Bank Transfer')}
                        >
                          <Building2 size={24} />
                          <span>Bank</span>
                        </div>
                      </div>
                    </div>
                    
                    {withdrawMethod === 'UPI' && (
                      <div className="form-group mb-4 animate-fade-in">
                        <label>UPI ID</label>
                        <input type="text" className="fancy-input" placeholder="e.g., username@bank" required />
                      </div>
                    )}
                    
                    {withdrawMethod === 'Bank Transfer' && (
                      <div className="form-group mb-4 animate-fade-in">
                        <label>Account Number</label>
                        <input type="text" className="fancy-input mb-2" placeholder="Account Number" required />
                        <label>IFSC Code</label>
                        <input type="text" className="fancy-input" placeholder="IFSC Code" required />
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100" disabled={withdrawLoading}>
                      {withdrawLoading ? 'Processing...' : `Confirm Withdrawal`}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Wallet;
