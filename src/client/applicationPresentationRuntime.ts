export type ApplicationPresentationCheckpointStore<_Selector, _Checkpoint> = {
	load: (selector: _Selector) => Promise<_Checkpoint | undefined>
	save: (selector: _Selector, checkpoint: _Checkpoint) => Promise<void>
}

export type ApplicationPresentationIdentity = {
	mountId: string
	subscriptionGeneration: number
	persistenceGeneration: number
	initialRevision: number
}

export type ApplicationPresentationSessionState<_Selector, _Checkpoint> =
	& ApplicationPresentationIdentity
	& {
		selector: _Selector
		initialCheckpoint: _Checkpoint | undefined
		saveCheckpoint: (checkpoint: _Checkpoint) => Promise<void>
	}

export type ApplicationPresentationRuntimeOptions<_Selector, _Checkpoint> = {
	selector: _Selector
	checkpointStore: ApplicationPresentationCheckpointStore<_Selector, _Checkpoint>
	checkpointRevision: (checkpoint: _Checkpoint) => number
	persistenceGeneration: number
	nextMountId: () => string
	nextSubscriptionGeneration: () => number
}

export const createApplicationPresentationSessionState = async <
	_Selector,
	_Checkpoint,
>({
	selector,
	checkpointStore,
	checkpointRevision,
	persistenceGeneration,
	nextMountId,
	nextSubscriptionGeneration,
}: ApplicationPresentationRuntimeOptions<
	_Selector,
	_Checkpoint
>): Promise<ApplicationPresentationSessionState<_Selector, _Checkpoint>> => {
	const mountId = nextMountId()
	const subscriptionGeneration = nextSubscriptionGeneration()
	const initialCheckpoint = await checkpointStore.load(selector)
	return {
		selector,
		mountId,
		subscriptionGeneration,
		persistenceGeneration,
		initialRevision: initialCheckpoint === undefined ?
			0
		:
			checkpointRevision(initialCheckpoint),
		initialCheckpoint,
		saveCheckpoint: (checkpoint) => checkpointStore.save(selector, checkpoint),
	}
}

export type ApplicationRuntimeCloser = {
	destroy: () => void | Promise<void>
}

const closeApplicationRuntime = async (
	presentation: ApplicationRuntimeCloser,
	navigation: ApplicationRuntimeCloser,
	client: ApplicationRuntimeCloser
) => {
	// oxlint-disable-next-line typescript/no-restricted-types -- JavaScript throw and Promise rejection values are untyped and must retain their original identities for AggregateError.
	const failures: unknown[] = []
	for (const owner of [presentation, navigation, client]) {
		try {
			await owner.destroy()
		} catch (error) {
			failures.push(error)
		}
	}
	if (failures.length !== 0)
		throw new AggregateError(failures, 'Application runtime teardown failed')
}

export const createApplicationRuntimeCloser = (
	presentation: ApplicationRuntimeCloser,
	navigation: ApplicationRuntimeCloser,
	client: ApplicationRuntimeCloser
): ApplicationRuntimeCloser => {
	let close: Promise<void> | undefined
	return {
		destroy: () => {
			close ??= closeApplicationRuntime(presentation, navigation, client)
			return close
		},
	}
}
