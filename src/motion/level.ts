/**
 * Motion level: full (default), reduced (final states), off.
 * prefers-reduced-motion maps to reduced; the footer control stores an override in localStorage['motion'].
 * The inline head script in Base.astro applies the same rule before first paint.
 */
export type MotionLevel = 'full' | 'reduced' | 'off';

export const MOTION_KEY = 'motion';
const LEVELS: MotionLevel[] = ['full', 'reduced', 'off'];

const reducedQuery = () => matchMedia('(prefers-reduced-motion: reduce)');

export function storedLevel(): MotionLevel | null {
	try {
		const value = localStorage.getItem(MOTION_KEY);
		return LEVELS.includes(value as MotionLevel) ? (value as MotionLevel) : null;
	} catch {
		return null;
	}
}

export function resolveLevel(): MotionLevel {
	return storedLevel() ?? (reducedQuery().matches ? 'reduced' : 'full');
}

export function motionLevel(): MotionLevel {
	const value = document.documentElement.dataset.motion as MotionLevel | undefined;
	return value && LEVELS.includes(value) ? value : 'reduced';
}

export function applyLevel(level: MotionLevel, root = document.documentElement) {
	root.dataset.motion = level;
}

/** Stores an override, or clears it with 'auto' so the OS preference applies again. */
export function setLevel(level: MotionLevel | 'auto') {
	try {
		if (level === 'auto') localStorage.removeItem(MOTION_KEY);
		else localStorage.setItem(MOTION_KEY, level);
	} catch {
		/* Motion stays usable without storage. */
	}
	applyLevel(resolveLevel());
}

export const isFull = () => motionLevel() === 'full';
