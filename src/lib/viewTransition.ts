import { tick } from 'svelte'

type ViewTransitionHandle = {
	skipTransition: () => void
	finished: Promise<void>
}

type DocumentWithViewTransitions = Document & {
	startViewTransition: (cb: () => void | Promise<void>) => ViewTransitionHandle
}

const documentHasStartViewTransition = (
	doc: Document,
): doc is DocumentWithViewTransitions => (
	'startViewTransition' in doc
)

const getDocumentWithViewTransitions = (): DocumentWithViewTransitions | undefined => (
	typeof document !== 'undefined' && documentHasStartViewTransition(document) ?
		document
	:
		undefined
)

export const supportsViewTransitions = (): boolean => (
	getDocumentWithViewTransitions() != null
)

/**
 * Serializes same-document view transitions without force-skipping the active one.
 * The first transition starts synchronously; later ones queue until the prior one settles.
 */
export const createSerialViewTransitionRunner = (): {
	start: (update: () => void | Promise<void>) => Promise<void>
} => {
	let inFlight: Promise<void> | null = null

	const track = (promise: Promise<void>) => {
		const settled = promise
			.catch(() => {})
			.finally(() => {
				if (inFlight === settled) inFlight = null
			})
		inFlight = settled
		return settled
	}

	const start = (update: () => void | Promise<void>) => {
		const doc = getDocumentWithViewTransitions()
		const runUpdate = async () => {
			await update()
			await tick()
		}

		if (!doc) return track(runUpdate())

		const startNow = () => (
			track(
				doc
					.startViewTransition(runUpdate)
					.finished,
			)
		)

		return inFlight ?
			track(
				inFlight.then(startNow),
			)
		:
			startNow()
	}

	return {
		start,
	}
}

/**
 * Encodes a value as a safe CSS `custom-ident` for `view-transition-name` and similar.
 * A leading digit gets a `_` prefix; characters outside `a-zA-Z0-9_-` become `_`.
 */
export const viewTransitionNameIdent = (key: string | number): string => (
	String(key).replace(/^\d/, '_$&').replace(/[^a-zA-Z0-9_-]/g, '_')
)

/**
 * A full `view-transition-name` string: `prefix` (default per-row list `list-item-`)
 * plus {@link viewTransitionNameIdent}(`key`). Pass a custom prefix for non-list names.
 */
export const viewTransitionName = (
	key: string | number,
	prefix = 'list-item-',
): string => (
	prefix + viewTransitionNameIdent(key)
)
