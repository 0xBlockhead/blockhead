import type { NetworkEntityPresentationV1, NetworkExecutionSection } from './NetworkEntityPresentationV1.ts'

export type NetworkPresentationAction =
	| Readonly<{ type: 'navigate', target: string, returnFocusKey?: string }>
	| Readonly<{ type: 'set-expanded', selectorKey: string, expanded: boolean }>
	| Readonly<{ type: 'select-section', section: NetworkExecutionSection }>
	| Readonly<{ type: 'retry', cellId: string, retryToken: string }>
	| Readonly<{ type: 'focus-main' }>
	| Readonly<{ type: 'back' }>

export type NetworkPresentationSubscriber = (
	snapshot: NetworkEntityPresentationV1
) => void

export type NetworkPresentationObservationCheckpoint = Readonly<{
	id: string
	fingerprint: string
	count: number
}>

export type NetworkPresentationFailureCheckpoint = Readonly<{
	id: string
	fingerprint: string
	ordinal: number
}>

export type NetworkPresentationCheckpoint = Readonly<{
	schemaVersion: 1
	selectorKey: string
	revision: number
	route: string
	persistenceGeneration: number
	observations: readonly NetworkPresentationObservationCheckpoint[]
	failures: readonly NetworkPresentationFailureCheckpoint[]
}>

export type NetworkPresentationSession = Readonly<{
	current: NetworkEntityPresentationV1
	checkpoint: NetworkPresentationCheckpoint
	/** Registers first, then synchronously emits current before later monotonic revisions. */
	subscribe(emit: NetworkPresentationSubscriber): () => void
	dispatch(action: NetworkPresentationAction): void | Promise<void>
	destroy(): void
	/** Settles after producer effects, dispatched actions, and checkpoint writes drain. */
	closed: Promise<void>
}>
