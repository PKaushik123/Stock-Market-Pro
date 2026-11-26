import { useEffect, useState } from 'react';

const BuySellModal = ({ open, onClose, onConfirm, mode = 'BUY', symbol, price, available, owned }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('MARKET');
  const [limitPrice, setLimitPrice] = useState(price);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setOrderType('MARKET');
      setLimitPrice(price);
      setError('');
    }
  }, [open, price]);

  if (!open) return null;

  const executionPrice = orderType === 'LIMIT' ? Number(limitPrice) : Number(price);
  const estimated = Number((Number(quantity) * executionPrice).toFixed(2));

  const confirm = async () => {
    setError('');
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setError('Quantity must be a whole number greater than zero');
      return;
    }
    if (!executionPrice || executionPrice <= 0) {
      setError('Enter a valid limit price');
      return;
    }
    if (mode === 'BUY' && estimated > available) {
      setError('Insufficient virtual balance');
      return;
    }
    if (mode === 'SELL' && Number(quantity) > (owned || 0)) {
      setError('Cannot sell more than owned quantity');
      return;
    }

    try {
      setProcessing(true);
      await onConfirm({
        quantity: Number(quantity),
        orderType,
        limitPrice: orderType === 'LIMIT' ? executionPrice : undefined,
      });
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to process order');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="Close trade dialog" className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Paper trade</p>
            <h3 className="mt-2 text-xl font-semibold text-white">{mode === 'BUY' ? `Buy ${symbol}` : `Sell ${symbol}`}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-white">×</button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-950 p-1">
          {['MARKET', 'LIMIT'].map((type) => (
            <button key={type} type="button" onClick={() => setOrderType(type)} className={`rounded-lg px-3 py-2 text-sm transition ${orderType === type ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:text-white'}`}>
              {type === 'MARKET' ? 'Market' : 'Limit'}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <div className="flex justify-between"><span>Simulated price</span><span className="text-white">₹{Number(price).toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span>Virtual cash</span><span className="text-white">₹{Number(available || 0).toLocaleString('en-IN')}</span></div>
          {mode === 'SELL' && <div className="flex justify-between"><span>Owned</span><span className="text-white">{owned || 0} shares</span></div>}
        </div>

        {orderType === 'LIMIT' && (
          <label className="mt-4 block text-sm text-slate-300">
            Limit price
            <input type="number" min="0.01" step="0.01" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-cyan-400" />
          </label>
        )}

        <label className="mt-4 block text-sm text-slate-300">
          Quantity
          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, Number(q) - 1))} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white">−</button>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-center text-white outline-none" />
            <button type="button" onClick={() => setQuantity((q) => Number(q) + 1)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white">+</button>
          </div>
        </label>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm">
          <span className="text-slate-400">Estimated value</span>
          <span className="font-semibold text-white">₹{estimated.toLocaleString('en-IN')}</span>
        </div>

        {error && <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200">Cancel</button>
          <button onClick={confirm} disabled={processing} className="ml-auto rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60">
            {processing ? 'Processing...' : mode === 'BUY' ? 'Confirm buy' : 'Confirm sell'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuySellModal;
