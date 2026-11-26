import { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Trophy, Zap } from 'lucide-react';

const modules = [
  { id: 'basics', title: 'Basics of the stock market', description: 'Shares, exchanges, orders and market participants.', xp: 100 },
  { id: 'candles', title: 'Candlestick patterns', description: 'Read opening, closing, high and low price behavior.', xp: 120 },
  { id: 'technical', title: 'Technical analysis', description: 'Trends, support, resistance and moving averages.', xp: 150 },
  { id: 'fundamental', title: 'Fundamental analysis', description: 'Valuation, financial statements and quality indicators.', xp: 150 },
  { id: 'funds', title: 'SIP, mutual funds and ETFs', description: 'Understand pooled investing and long-term allocation.', xp: 120 },
  { id: 'risk', title: 'Risk management', description: 'Position sizing, diversification and loss limits.', xp: 150 },
  { id: 'psychology', title: 'Trading psychology', description: 'Manage bias, discipline and emotional decisions.', xp: 120 },
];

const questions = {
  basics: {
    question: 'What does buying a share represent?',
    options: ['A loan to the company', 'A small ownership stake', 'A guaranteed fixed return'],
    answer: 1,
  },
  candles: {
    question: 'What does a candlestick body primarily show?',
    options: ['Open and close range', 'Only trading volume', 'Only the 52-week high'],
    answer: 0,
  },
  technical: {
    question: 'What is support?',
    options: ['A price area where buying interest may emerge', 'A guaranteed floor', 'Company dividend income'],
    answer: 0,
  },
};

const storageKey = 'stockmarket_academy_progress';

const readProgress = () => {
  try { return JSON.parse(localStorage.getItem(storageKey)) || { completed: [], streak: 1, xp: 0 }; }
  catch { return { completed: [], streak: 1, xp: 0 }; }
};

const AcademyPage = () => {
  const [progress, setProgress] = useState(readProgress);
  const [active, setActive] = useState(modules[0]);
  const [selected, setSelected] = useState(null);
  const [quizMessage, setQuizMessage] = useState('');

  const quiz = questions[active.id];
  const percent = useMemo(() => Math.round((progress.completed.length / modules.length) * 100), [progress.completed.length]);

  const saveProgress = (next) => {
    setProgress(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const submitAnswer = () => {
    if (!quiz || selected === null) {
      setQuizMessage('Choose an answer to continue.');
      return;
    }
    if (selected !== quiz.answer) {
      setQuizMessage('Not quite. Review the concept and try again.');
      return;
    }

    if (!progress.completed.includes(active.id)) {
      saveProgress({
        ...progress,
        completed: [...progress.completed, active.id],
        xp: progress.xp + active.xp,
        streak: progress.streak + 1,
      });
      setQuizMessage(`Correct! ${active.xp} XP earned.`);
    } else {
      setQuizMessage('Correct! You already completed this lesson.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Stock Market Academy</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Build market knowledge</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">Learn at your pace with concise lessons and knowledge checks. Practice with simulated data—this is education, not a live trading signal.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center"><Zap className="mx-auto h-4 w-4 text-amber-300" /><p className="mt-1 text-lg font-bold text-white">{progress.xp}</p><p className="text-xs text-slate-400">XP</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center"><Trophy className="mx-auto h-4 w-4 text-cyan-300" /><p className="mt-1 text-lg font-bold text-white">{progress.completed.length}</p><p className="text-xs text-slate-400">Badges</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-center"><span className="block text-amber-300">{progress.streak}</span><p className="mt-1 text-lg font-bold text-white">{progress.streak}</p><p className="text-xs text-slate-400">Day streak</p></div>
          </div>
        </div>
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-xs text-slate-400"><span>Learning progress</span><span>{percent}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-950"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${percent}%` }} /></div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-semibold text-white">Learning path</h2>
          <div className="mt-4 space-y-2">
            {modules.map((module) => {
              const complete = progress.completed.includes(module.id);
              return (
                <button key={module.id} onClick={() => { setActive(module); setSelected(null); setQuizMessage(''); }} className={`w-full rounded-xl border p-3 text-left transition ${active.id === module.id ? 'border-cyan-400/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-950 hover:border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${complete ? 'bg-emerald-500/15 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{complete ? <CheckCircle2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}</div>
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{module.title}</p><p className="mt-1 text-xs text-slate-400">{module.xp} XP</p></div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Lesson</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{active.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{active.description} This module introduces practical concepts in plain language and encourages risk-aware decision making. Use the paper-trading environment to test ideas without risking real money.</p>

          {quiz ? (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-5">
              <p className="font-medium text-white">Knowledge check</p>
              <p className="mt-2 text-sm text-slate-300">{quiz.question}</p>
              <div className="mt-4 space-y-2">
                {quiz.options.map((option, index) => (
                  <button key={option} onClick={() => setSelected(index)} className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${selected === index ? 'border-cyan-400 bg-cyan-500/10 text-white' : 'border-slate-800 text-slate-300 hover:border-slate-700'}`}>{option}</button>
                ))}
              </div>
              {quizMessage && <p className="mt-3 text-sm text-cyan-300">{quizMessage}</p>}
              <button onClick={submitAnswer} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Submit answer</button>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-5 text-sm text-slate-400">Knowledge check coming soon. Continue with the lesson overview and practice the concept in paper trading.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AcademyPage;
