import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
	getDailyPuzzle,
	msUntilNextPuzzle,
	MAX_GUESSES,
	WORD_LENGTH,
	WORDS,
	type CyberWord
} from './words';

type Evaluation = 'correct' | 'present' | 'absent';
type GameStatus = 'playing' | 'won' | 'lost';

interface GameState {
	guesses: string[];
	status: GameStatus;
}

interface Stats {
	played: number;
	wins: number;
	currentStreak: number;
	maxStreak: number;
	distribution: number[];
	lastPuzzle: number | null;
	lastResult: 'won' | 'lost' | null;
}

const STATE_PREFIX = 'cyberdle:v1:state:';
const STATS_KEY = 'cyberdle:v1:stats';
const SEED_KEY = 'cyberdle:v1:seed';

// A random, persistent per-user offset into the word list, so every visitor
// gets a different daily word instead of everyone sharing the same one.
function getUserSeed(): number {
	try {
		const raw = localStorage.getItem(SEED_KEY);
		if (raw !== null) {
			const parsed = parseInt(raw, 10);
			if (!Number.isNaN(parsed)) return parsed;
		}
		const seed = Math.floor(Math.random() * WORDS.length);
		localStorage.setItem(SEED_KEY, String(seed));
		return seed;
	} catch {
		return 0;
	}
}

const DEFAULT_STATS: Stats = {
	played: 0,
	wins: 0,
	currentStreak: 0,
	maxStreak: 0,
	distribution: [0, 0, 0, 0, 0, 0],
	lastPuzzle: null,
	lastResult: null
};

const KEYBOARD_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'] as const;
const RANK: Record<Evaluation, number> = { absent: 0, present: 1, correct: 2 };

// Fixed tile colors so the board reads the same in light and dark — terminal
// green for a hit, brand amber for a near miss, warm stone for a miss.
const TILE_COLORS: Record<Evaluation, { background: string; color: string }> = {
	correct: { background: '#15803d', color: '#ffffff' },
	present: { background: '#b45309', color: '#ffffff' },
	absent: { background: '#78716c', color: '#ffffff' }
};

function evaluateGuess(guess: string, answer: string): Evaluation[] {
	const result: Evaluation[] = Array.from({ length: WORD_LENGTH }, () => 'absent');
	const answerChars: (string | null)[] = answer.split('');
	const guessChars = guess.split('');

	for (let i = 0; i < WORD_LENGTH; i++) {
		if (guessChars[i] === answerChars[i]) {
			result[i] = 'correct';
			answerChars[i] = null;
		}
	}
	for (let i = 0; i < WORD_LENGTH; i++) {
		if (result[i] === 'correct') continue;
		const g = guessChars[i];
		if (g === undefined) continue;
		const idx = answerChars.indexOf(g);
		if (idx !== -1) {
			result[i] = 'present';
			answerChars[idx] = null;
		}
	}
	return result;
}

function buildKeyStates(guesses: string[], answer: string): Record<string, Evaluation> {
	const states: Record<string, Evaluation> = {};
	for (const guess of guesses) {
		const evals = evaluateGuess(guess, answer);
		for (let i = 0; i < WORD_LENGTH; i++) {
			const ch = guess[i];
			const ev = evals[i];
			if (ch === undefined || ev === undefined) continue;
			const prev = states[ch];
			if (prev === undefined || RANK[ev] > RANK[prev]) states[ch] = ev;
		}
	}
	return states;
}

function loadGameState(puzzleNumber: number): GameState | null {
	try {
		const raw = localStorage.getItem(`${STATE_PREFIX}${puzzleNumber}`);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<GameState>;
		if (!Array.isArray(parsed.guesses)) return null;
		const status: GameStatus =
			parsed.status === 'won' || parsed.status === 'lost' ? parsed.status : 'playing';
		return { guesses: parsed.guesses.filter((g) => typeof g === 'string'), status };
	} catch {
		return null;
	}
}

function saveGameState(puzzleNumber: number, state: GameState): void {
	try {
		localStorage.setItem(`${STATE_PREFIX}${puzzleNumber}`, JSON.stringify(state));
	} catch {
		/* storage unavailable — game still works for the session */
	}
}

function loadStats(): Stats {
	try {
		const raw = localStorage.getItem(STATS_KEY);
		if (!raw) return { ...DEFAULT_STATS };
		const parsed = JSON.parse(raw) as Partial<Stats>;
		return {
			...DEFAULT_STATS,
			...parsed,
			distribution: Array.isArray(parsed.distribution)
				? DEFAULT_STATS.distribution.map((_, i) => Number(parsed.distribution?.[i] ?? 0))
				: [...DEFAULT_STATS.distribution]
		};
	} catch {
		return { ...DEFAULT_STATS };
	}
}

function saveStats(stats: Stats): void {
	try {
		localStorage.setItem(STATS_KEY, JSON.stringify(stats));
	} catch {
		/* ignore */
	}
}

function recordResult(prev: Stats, won: boolean, puzzleNumber: number, guessCount: number): Stats {
	if (prev.lastPuzzle === puzzleNumber) return prev; // already recorded today
	const consecutive = prev.lastPuzzle !== null && puzzleNumber === prev.lastPuzzle + 1;
	const currentStreak = won ? (consecutive ? prev.currentStreak + 1 : 1) : 0;
	const distribution = [...prev.distribution];
	if (won) {
		const idx = guessCount - 1;
		distribution[idx] = (distribution[idx] ?? 0) + 1;
	}
	return {
		played: prev.played + 1,
		wins: prev.wins + (won ? 1 : 0),
		currentStreak,
		maxStreak: Math.max(prev.maxStreak, currentStreak),
		distribution,
		lastPuzzle: puzzleNumber,
		lastResult: won ? 'won' : 'lost'
	};
}

function formatDuration(ms: number): string {
	const total = Math.max(0, Math.floor(ms / 1000));
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function Cyberdle() {
	const { puzzleNumber, answer } = useMemo<{ puzzleNumber: number; answer: CyberWord }>(
		() => getDailyPuzzle(new Date(), getUserSeed()),
		[]
	);

	const [guesses, setGuesses] = useState<string[]>([]);
	const [current, setCurrent] = useState('');
	const [status, setStatus] = useState<GameStatus>('playing');
	const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
	const [toast, setToast] = useState<string | null>(null);
	const [animateRow, setAnimateRow] = useState<number | null>(null);
	const [shake, setShake] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [countdown, setCountdown] = useState('');

	const toastTimer = useRef<number | null>(null);

	const showToast = useCallback((message: string) => {
		setToast(message);
		if (toastTimer.current) window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(null), 1600);
	}, []);

	// Restore today's game + lifetime stats on mount.
	useEffect(() => {
		setStats(loadStats());
		const saved = loadGameState(puzzleNumber);
		if (saved) {
			setGuesses(saved.guesses);
			setStatus(saved.status);
			if (saved.status !== 'playing') setShowResult(true);
		}
	}, [puzzleNumber]);

	// Countdown to the next daily puzzle.
	useEffect(() => {
		const tick = () => setCountdown(formatDuration(msUntilNextPuzzle()));
		tick();
		const id = window.setInterval(tick, 1000);
		return () => window.clearInterval(id);
	}, []);

	const submitGuess = useCallback(() => {
		if (status !== 'playing') return;
		if (current.length < WORD_LENGTH) {
			showToast('Not enough letters');
			setShake(true);
			window.setTimeout(() => setShake(false), 500);
			return;
		}

		const guess = current;
		const nextGuesses = [...guesses, guess];
		const won = guess === answer.word;
		const lost = !won && nextGuesses.length >= MAX_GUESSES;
		const nextStatus: GameStatus = won ? 'won' : lost ? 'lost' : 'playing';
		const revealRow = nextGuesses.length - 1;

		setGuesses(nextGuesses);
		setCurrent('');
		setAnimateRow(revealRow);
		setStatus(nextStatus);
		saveGameState(puzzleNumber, { guesses: nextGuesses, status: nextStatus });

		if (nextStatus !== 'playing') {
			setStats((prev) => {
				const updated = recordResult(prev, won, puzzleNumber, nextGuesses.length);
				saveStats(updated);
				return updated;
			});
			const revealMs = WORD_LENGTH * 150 + 400;
			window.setTimeout(() => {
				setShowResult(true);
				if (won) {
					confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, disableForReducedMotion: true });
				} else {
					showToast(answer.word);
				}
			}, revealMs);
		}
	}, [answer.word, current, guesses, puzzleNumber, showToast, status]);

	const handleKey = useCallback(
		(rawKey: string) => {
			if (status !== 'playing') return;
			const key = rawKey.toUpperCase();
			if (key === 'ENTER') {
				submitGuess();
			} else if (key === 'BACKSPACE' || key === 'DEL') {
				setCurrent((c) => c.slice(0, -1));
			} else if (/^[A-Z]$/.test(key)) {
				setCurrent((c) => (c.length < WORD_LENGTH ? c + key : c));
			}
		},
		[status, submitGuess]
	);

	// Physical keyboard support.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			const key = event.key;
			if (key === 'Enter' || key === 'Backspace' || /^[a-zA-Z]$/.test(key)) {
				event.preventDefault();
				handleKey(key);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleKey]);

	const keyStates = useMemo(() => buildKeyStates(guesses, answer.word), [guesses, answer.word]);

	const rows = useMemo(() => {
		const out: { letters: string[]; evals: Evaluation[] | null; isCurrent: boolean }[] = [];
		for (let r = 0; r < MAX_GUESSES; r++) {
			const submitted = guesses[r];
			if (submitted !== undefined) {
				out.push({ letters: submitted.split(''), evals: evaluateGuess(submitted, answer.word), isCurrent: false });
			} else if (r === guesses.length && status === 'playing') {
				const letters = Array.from({ length: WORD_LENGTH }, (_, i) => current[i] ?? '');
				out.push({ letters, evals: null, isCurrent: true });
			} else {
				out.push({ letters: Array.from({ length: WORD_LENGTH }, () => ''), evals: null, isCurrent: false });
			}
		}
		return out;
	}, [guesses, current, status, answer.word]);

	const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
	const maxDist = Math.max(1, ...stats.distribution);

	const handleShare = useCallback(async () => {
		const header = `Cyberdle #${puzzleNumber} ${status === 'won' ? guesses.length : 'X'}/${MAX_GUESSES}`;
		const grid = guesses
			.map((g) =>
				evaluateGuess(g, answer.word)
					.map((e) => (e === 'correct' ? '🟩' : e === 'present' ? '🟨' : '⬛'))
					.join('')
			)
			.join('\n');
		const url = `${window.location.origin}/cyberdle`;
		const text = `${header}\n${grid}\n${url}`;
		try {
			await navigator.clipboard.writeText(text);
			showToast('Results copied');
		} catch {
			showToast('Copy failed');
		}
	}, [answer.word, guesses, puzzleNumber, showToast, status]);

	return (
		<div className="w-full pb-16">
			<style>{CSS}</style>

			{/* Puzzle meta, mono, quiet — sits under the editorial header */}
			<div className="meta-mono mt-4">
				#{puzzleNumber} · next word in {countdown}
			</div>

			<div className="mx-auto mt-10 flex w-full max-w-[22rem] flex-col items-center gap-5 sm:max-w-sm">
			{/* Board */}
			<div className="grid gap-1.5" aria-label="Cyberdle board">
				{rows.map((row, r) => (
					<div key={r} className={`flex gap-1.5 ${shake && row.isCurrent ? 'cd-shake' : ''}`}>
						{row.letters.map((letter, c) => {
							const ev = row.evals?.[c];
							const animate = animateRow === r && ev !== undefined;
							const style = ev ? TILE_COLORS[ev] : undefined;
							return (
								<div
									key={`${r}-${c}-${letter}-${ev ?? 'na'}`}
									className={`flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-md border-2 font-mono text-2xl font-bold uppercase ${
										ev
											? 'border-transparent'
											: letter
												? 'border-faint text-fg cd-pop'
												: 'border-line text-fg'
									} ${animate ? 'cd-flip' : ''}`}
									style={animate ? { ...style, animationDelay: `${c * 150}ms` } : style}
								>
									{letter}
								</div>
							);
						})}
					</div>
				))}
			</div>

			{/* Toast */}
			<div className="relative h-0 w-full" aria-live="polite">
				{toast && (
					<div className="bg-fg text-bg absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-md px-4 py-2 text-sm font-medium shadow-lg">
						{toast}
					</div>
				)}
			</div>

			{/* Keyboard */}
			<div className="flex w-full flex-col items-center gap-1.5 select-none">
				{KEYBOARD_ROWS.map((rowKeys, i) => (
					<div key={i} className="flex w-full justify-center gap-1.5">
						{i === KEYBOARD_ROWS.length - 1 && (
							<KeyButton label="Enter" wide onPress={() => handleKey('ENTER')} />
						)}
						{rowKeys.split('').map((k) => (
							<KeyButton key={k} label={k} state={keyStates[k]} onPress={() => handleKey(k)} />
						))}
						{i === KEYBOARD_ROWS.length - 1 && (
							<KeyButton label="⌫" wide ariaLabel="Backspace" onPress={() => handleKey('BACKSPACE')} />
						)}
					</div>
				))}
			</div>

			{/* Result — a quiet block under the board, no card chrome */}
			{showResult && (
				<div className="border-line animate-fade-up w-full border-t pt-6">
					<h2 className="font-display text-fg text-xl font-medium tracking-[-0.01em]">
						{status === 'won' ? 'Nice work.' : 'Out of attempts.'}
					</h2>
					<p className="text-muted mt-2 text-sm leading-[1.6]">
						The word was{' '}
						<span className="text-accent font-mono font-semibold tracking-wider">{answer.word}</span>.{' '}
						{answer.clue}
					</p>

					<div className="mt-5 space-y-1.5">
						<p className="meta-mono mb-2.5 uppercase tracking-[0.06em]">Guess distribution</p>
						{stats.distribution.map((count, i) => {
							const isRowWin = status === 'won' && guesses.length === i + 1;
							return (
								<div key={i} className="flex items-center gap-2 text-xs">
									<span className="text-subtle w-3 font-mono">{i + 1}</span>
									<div className="bg-surface-2 h-5 flex-1 overflow-hidden rounded-sm">
										<div
											className="flex h-full items-center justify-end rounded-sm px-2 font-mono font-semibold text-white"
											style={{
												width: `${Math.max(8, (count / maxDist) * 100)}%`,
												background: isRowWin ? '#15803d' : '#78716c'
											}}
										>
											{count}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
			</div>

			{/* Stats — a hairline row, not a card */}
			<div className="border-line mt-12 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-5 border-t pt-6">
				<div className="flex flex-wrap gap-x-10 gap-y-5 sm:gap-x-14">
					<StatBig value={String(stats.played)} label="Played" />
					<StatBig value={`${winPct}%`} label="Win rate" />
					<StatBig value={String(stats.currentStreak)} label="Streak" />
					<StatBig value={String(stats.maxStreak)} label="Max streak" />
				</div>
				{status !== 'playing' && (
					<button
						onClick={handleShare}
						className="text-muted hover:text-fg text-sm font-medium transition-colors"
					>
						Share result →
					</button>
				)}
			</div>
		</div>
	);
}

function StatBig({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<div className="font-display text-fg text-[28px] font-medium tracking-[-0.015em] tabular-nums">
				{value}
			</div>
			<div className="text-subtle mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.06em]">
				{label}
			</div>
		</div>
	);
}

function KeyButton({
	label,
	state,
	wide,
	ariaLabel,
	onPress
}: {
	label: string;
	state?: Evaluation;
	wide?: boolean;
	ariaLabel?: string;
	onPress: () => void;
}) {
	const style = state ? TILE_COLORS[state] : undefined;
	return (
		<button
			type="button"
			aria-label={ariaLabel ?? label}
			onClick={onPress}
			style={style}
			className={`flex h-12 items-center justify-center rounded-md text-sm font-medium uppercase transition-colors ${
				wide ? 'flex-[1.5] text-xs' : 'flex-1'
			} ${state ? '' : 'bg-line/60 text-fg hover:bg-line'}`}
		>
			{label}
		</button>
	);
}

const CSS = `
@media (prefers-reduced-motion: no-preference) {
	.cd-pop { animation: cd-pop 0.1s ease-in-out; }
	.cd-flip { animation: cd-flip 0.5s ease forwards; backface-visibility: hidden; }
	.cd-shake { animation: cd-shake 0.5s ease-in-out; }
}
@keyframes cd-pop { 0% { transform: scale(0.85); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
@keyframes cd-flip { 0% { transform: rotateX(0deg); } 50% { transform: rotateX(-90deg); } 100% { transform: rotateX(0deg); } }
@keyframes cd-shake {
	10%, 90% { transform: translateX(-1px); }
	20%, 80% { transform: translateX(2px); }
	30%, 50%, 70% { transform: translateX(-4px); }
	40%, 60% { transform: translateX(4px); }
}
`;
