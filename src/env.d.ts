/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_GA_MEASUREMENT_ID?: string;
	readonly PUBLIC_GISCUS_REPO?: string;
	readonly PUBLIC_GISCUS_REPO_ID?: string;
	readonly PUBLIC_GISCUS_CATEGORY?: string;
	readonly PUBLIC_GISCUS_CATEGORY_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module 'canvas-confetti' {
	interface ConfettiOptions {
		particleCount?: number;
		spread?: number;
		origin?: { x?: number; y?: number };
		disableForReducedMotion?: boolean;
	}
	const confetti: (options?: ConfettiOptions) => Promise<void> | null;
	export default confetti;
}
