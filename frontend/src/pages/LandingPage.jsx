import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, ShieldCheck, Wallet, Newspaper } from 'lucide-react';

const features = [
	{
		icon: BarChart3,
		title: 'Real-time market dashboard',
		description:
			'Track key indices, price movement and performance across popular stocks.',
	},
	{
		icon: Wallet,
		title: 'Virtual trading',
		description:
			'Practice simulated buy and sell orders with a built-in paper-money portfolio.',
	},
	{
		icon: ShieldCheck,
		title: 'Secure accounts',
		description:
			'Keep your holdings protected behind authenticated sessions and hashed passwords.',
	},
	{
		icon: Newspaper,
		title: 'Market news',
		description:
			'Stay informed with clearly labeled mock market updates and trading headlines.',
	},
];

const LandingPage = () => (
	<div className="min-h-screen bg-slate-950 text-slate-100">
		<header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
			<div className="flex items-center gap-3 font-semibold tracking-wide">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
					<BarChart3 className="h-5 w-5" />
				</div>
				<span>StockMarket Pro</span>
			</div>
			<div className="flex items-center gap-3">
				<Link
					to="/login"
					className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-slate-500"
				>
					Login
				</Link>
				<Link
					to="/signup"
					className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-cyan-400"
				>
					Get started
				</Link>
			</div>
		</header>

		<main>
			<section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:items-center">
				<div>
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
						Paper Trading Platform
					</div>
					<h1 className="max-w-xl text-5xl font-bold tracking-tight text-white md:text-6xl">
						Learn the market with confidence.
					</h1>
					<p className="mt-6 max-w-lg text-lg text-slate-300">
						Build your strategy in a practice-only trading environment with mock
						prices, portfolio tracking, and simulated orders.
					</p>
					<div className="mt-8 flex flex-wrap gap-4">
						<Link
							to="/signup"
							className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-400"
						>
							Start trading{' '}
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link
							to="/login"
							className="rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 hover:border-slate-500"
						>
							Existing user
						</Link>
					</div>
					<div className="mt-10 flex items-center gap-8 text-sm text-slate-400">
						<div>
							<span className="block text-2xl font-bold text-white">₹1,000</span>
							Virtual balance
						</div>
						<div>
							<span className="block text-2xl font-bold text-white">24/7</span>
							Practice mode
						</div>
					</div>
				</div>

				<div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-glow">
					<div className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
						<div className="mb-6 flex items-center justify-between">
							<span className="text-sm text-slate-400">Portfolio overview</span>
							<span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
								Simulated data
							</span>
						</div>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="rounded-xl bg-slate-900 p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
									Virtual cash
								</p>
								<p className="mt-2 text-2xl font-bold text-white">
									₹1,000
								</p>
							</div>
							<div className="rounded-xl bg-slate-900 p-4">
								<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
									Practice status
								</p>
								<p className="mt-2 text-2xl font-bold text-cyan-300">
									Paper trade
								</p>
							</div>
						</div>
						<div className="mt-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-4">
							<div className="mb-3 flex items-center justify-between text-sm text-slate-300">
								<span>Top movers</span>
								<span className="text-green-400">+2.24%</span>
							</div>
							<div className="flex items-end gap-2">
								{[35, 52, 44, 68, 84, 92].map((height, index) => (
									<div
										key={index}
										className="flex-1 rounded-t-md bg-cyan-500/80"
										style={{ height: `${height}px` }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-20">
				<div className="mb-10 text-center">
					<p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
						Why paper trade
					</p>
					<h2 className="mt-3 text-3xl font-bold text-white">
						A safe way to understand market behavior.
					</h2>
				</div>
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{features.map(
						({ icon: Icon, title, description }) => (
							<div
								key={title}
								className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
							>
								<div className="mb-4 inline-flex rounded-xl bg-cyan-500/10 p-3 text-cyan-300">
									<Icon className="h-5 w-5" />
								</div>
								<h3 className="mb-2 text-lg font-semibold text-white">
									{title}
								</h3>
								<p className="text-sm text-slate-400">
									{description}
								</p>
							</div>
						)
					)}
				</div>
			</section>

			<section className="mx-auto max-w-7xl px-6 pb-20">
				<div className="grid gap-8 md:grid-cols-3">
					{[
						'Create an account and receive virtual capital.',
						'Explore stocks, watchlists and historical trends.',
						'Practice buying and selling with simulated orders.',
					].map((step, index) => (
						<div
							key={step}
							className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
						>
							<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-bold text-cyan-300">
								0{index + 1}
							</div>
							<p className="text-base text-slate-200">{step}</p>
						</div>
					))}
				</div>
			</section>
		</main>

		<footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-400">
			StockMarket Pro is a simulated paper-trading application for educational use
			only.
		</footer>
	</div>
);

export default LandingPage;
