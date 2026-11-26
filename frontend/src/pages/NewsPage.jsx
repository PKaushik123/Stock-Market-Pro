import { useMemo, useState } from 'react';

const newsItems = [
	{
		title: 'Illustrative: Indian equities steady as investors watch rate expectations',
		source: 'Sample Market Desk',
		category: 'neutral',
		symbol: 'NIFTY',
		summary: 'This is an educational sample item, not a live news report or investment recommendation.',
	},
	{
		title: 'Illustrative: Reliance expansion discussion supports a positive long-term thesis',
		source: 'Sample NewsWire',
		category: 'bullish',
		symbol: 'RELIANCE',
		summary: 'A fictional-format example for discussing how company developments may be interpreted.',
	},
	{
		title: 'Illustrative: IT sector sensitivity to global demand remains a key risk',
		source: 'Sample Business Pulse',
		category: 'bearish',
		symbol: 'TCS',
		summary: 'A fictional-format example intended to demonstrate bearish scenario analysis.',
	},
];

const NewsPage = () => {
	const [category, setCategory] = useState('all');
	const items = useMemo(
		() => (category === 'all' ? newsItems : newsItems.filter((item) => item.category === category)),
		[category]
	);

	return (
		<div className="space-y-6">
			<section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Market insights</p>
						<h1 className="mt-2 text-3xl font-bold text-white">News & trends</h1>
						<p className="mt-2 text-sm text-slate-400">Clearly labeled educational samples—not live, verified or actionable news.</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{['all', 'bullish', 'bearish', 'neutral'].map((item) => (
							<button
								key={item}
								onClick={() => setCategory(item)}
								className={`rounded-lg px-3 py-2 text-sm capitalize ${category === item ? 'bg-cyan-500 text-slate-950' : 'border border-slate-800 bg-slate-950 text-slate-300'}`}
							>
								{item}
							</button>
						))}
					</div>
				</div>
			</section>

			<div className="grid gap-4 lg:grid-cols-3">
				{items.map((article) => (
					<article key={article.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
						<div className="mb-4 flex items-center justify-between gap-3">
							<span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">{article.symbol}</span>
							<span
								className={`rounded-full px-2 py-1 text-xs capitalize ${
									article.category === 'bullish'
										? 'bg-emerald-500/10 text-emerald-300'
										: article.category === 'bearish'
										? 'bg-red-500/10 text-red-300'
										: 'bg-slate-700/50 text-slate-300'
								}`}
							>
								{article.category}
							</span>
						</div>
						<h2 className="text-lg font-semibold leading-7 text-white">{article.title}</h2>
						<p className="mt-3 text-sm leading-6 text-slate-400">{article.summary}</p>
						<p className="mt-5 text-xs uppercase tracking-[0.15em] text-cyan-300">{article.source}</p>
					</article>
				))}
			</div>

			{items.length === 0 && (
				<div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center text-slate-400">
					No sample insights in this category.
				</div>
			)}
		</div>
	);
};

export default NewsPage;
