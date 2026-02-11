import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Minus, ArrowUpRight, ArrowDownLeft, Trash2, X } from 'lucide-react';
import { storage } from '../api';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Cash = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('deposit');
  const [formData, setFormData] = useState({ amount: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const userId = storage.getUserId();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const fetchData = async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`${API}/cash/balance?user_id=${userId}`),
        axios.get(`${API}/cash/transactions?user_id=${userId}`)
      ]);
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
    } catch (error) {
      console.error('Error fetching cash data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setFormData({ amount: '', description: '' });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Veuillez entrer un montant valide');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API}/cash/transaction?user_id=${userId}`, {
        type: modalType,
        amount: parseFloat(formData.amount),
        description: formData.description || (modalType === 'deposit' ? 'Dépôt' : 'Retrait')
      });
      await fetchData();
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.detail || 'Erreur lors de la transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (transactionId) => {
    if (!window.confirm('Supprimer cette transaction ?')) return;
    try {
      await axios.delete(`${API}/cash/transaction/${transactionId}?user_id=${userId}`);
      await fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="display-md" style={{ marginBottom: '8px' }}>Gestion du Cash</h1>
        <p className="body-md" style={{ color: 'var(--text-muted)' }}>Suivez vos liquidités et mouvements de fonds</p>
      </div>

      {/* Balance Card */}
      <div className="card" style={{ 
        marginBottom: '32px', 
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        border: '2px solid var(--accent-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              background: 'var(--accent-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={32} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Solde disponible</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {formatCurrency(balance)}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-primary" 
              onClick={() => openModal('deposit')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              data-testid="deposit-btn"
            >
              <Plus size={20} />
              Dépôt
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => openModal('withdrawal')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              data-testid="withdrawal-btn"
            >
              <Minus size={20} />
              Retrait
            </button>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="card">
        <h2 className="h2" style={{ marginBottom: '24px' }}>Historique des mouvements</h2>
        
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
            <Wallet size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>Aucun mouvement de cash enregistré</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map(transaction => (
              <div 
                key={transaction.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${transaction.type === 'deposit' ? 'var(--success)' : 'var(--danger)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: transaction.type === 'deposit' ? 'var(--success-bg)' : 'var(--danger-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {transaction.type === 'deposit' ? (
                      <ArrowDownLeft size={20} color="var(--success)" />
                    ) : (
                      <ArrowUpRight size={20} color="var(--danger)" />
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {transaction.description || (transaction.type === 'deposit' ? 'Dépôt' : 'Retrait')}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      {new Date(transaction.date).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: transaction.type === 'deposit' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    style={{
                      padding: '8px',
                      border: 'none',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px'
        }}>
          <div className="card" style={{ maxWidth: '450px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: modalType === 'deposit' ? 'var(--success-bg)' : 'var(--danger-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {modalType === 'deposit' ? (
                  <Plus size={24} color="var(--success)" />
                ) : (
                  <Minus size={24} color="var(--danger)" />
                )}
              </div>
              <h2 className="h2">{modalType === 'deposit' ? 'Nouveau dépôt' : 'Nouveau retrait'}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Montant (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input-field"
                  style={{ fontSize: '24px', fontWeight: '600', textAlign: 'center' }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Description (optionnel)
                </label>
                <input
                  type="text"
                  placeholder={modalType === 'deposit' ? 'Ex: Virement bancaire' : 'Ex: Achat actions'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <button 
                className={modalType === 'deposit' ? 'btn-primary' : 'btn-secondary'}
                onClick={handleSubmit}
                disabled={submitting || !formData.amount}
                style={{ 
                  width: '100%', 
                  marginTop: '8px',
                  background: modalType === 'withdrawal' ? 'var(--danger)' : undefined
                }}
              >
                {submitting ? 'En cours...' : (modalType === 'deposit' ? 'Déposer' : 'Retirer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cash;
