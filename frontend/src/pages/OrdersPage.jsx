import { useEffect, useState } from 'react';
import portfolioService from '../services/portfolioService';
import { useAuth } from '../context/useAuth.js';
import orderApi from '../services/orderApi';

const fallbackOrders = [];

const OrdersPage = () => {
  const [orders, setOrders] = useState(fallbackOrders);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (token) {
          try {
            const res = await orderApi.getOrders();
            setOrders(res?.data?.orders || fallbackOrders);
          } catch {
            const id = user?.id || user?._id || 'guest';
            const pOrders = await portfolioService.getOrders(id);
            setOrders(pOrders.length ? pOrders : fallbackOrders);
          }
        } else {
          const id = user?.id || user?._id || 'guest';
          const pOrders = await portfolioService.getOrders(id);
          setOrders(pOrders.length ? pOrders : fallbackOrders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
        setOrders(fallbackOrders);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, user]);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-white">Orders</h1>
      <p className="mt-2 text-slate-400">Your simulated transaction history appears here.</p>

      {loading ? (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4 text-slate-300">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-12 text-center">
          <p className="font-semibold text-white">No paper-trading orders yet</p>
          <p className="mt-2 text-sm text-slate-400">Buy or sell a stock to create your first transaction.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
            <thead className="bg-slate-950">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {orders.map((order) => (
                <tr key={order._id || `${order.symbol}-${order.createdAt}`}>
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.symbol}</td>
                  <td className={`px-4 py-3 ${order.side === 'BUY' ? 'text-emerald-400' : 'text-cyan-300'}`}>{order.side}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">₹{Number(order.totalValue || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-emerald-400">{order.status || 'EXECUTED'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
