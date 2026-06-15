<script lang="ts">
	// Types/constants
	import {
		type TanStackLiveQuerySnapshot,
		TanStackLiveQueryResource,
	} from '$/lib/db/queryResource.svelte.ts'


	const initialQuery = {
		data: '',
		isLoading: true,
		isError: false,
		isReady: false,
		status: 'loading',
	} satisfies TanStackLiveQuerySnapshot<string>
	let query = $state<TanStackLiveQuerySnapshot<string>>(initialQuery)
	const queryListeners = new Set<() => void>()
	const resource = new TanStackLiveQueryResource(
		() => query,
		(update) => {
			queryListeners.add(update)
			return () => {
				queryListeners.delete(update)
			}
		},
	)

	const applyQuery = (
		nextQuery: TanStackLiveQuerySnapshot<string>,
	) => {
		query.data = nextQuery.data
		query.isLoading = nextQuery.isLoading
		query.isError = nextQuery.isError
		query.isReady = nextQuery.isReady
		query.error = nextQuery.error
		query.status = nextQuery.status
		for (const listener of queryListeners)
			listener()
	}
</script>


<h1>Query resource adapter getter test route</h1>

<section>
	<h2>TanStack adapter getter state machine</h2>

	<button
		data-testid="adapter-ready-button"
		onclick={() => applyQuery({
			data: 'Ready value',
			isLoading: false,
			isError: false,
			isReady: true,
			status: 'ready',
		})}
	>
		Adapter ready
	</button>

	<button
		data-testid="adapter-refresh-loading-button"
		onclick={() => applyQuery({
			data: 'Ready value',
			isLoading: true,
			isError: false,
			isReady: false,
			status: 'loading',
		})}
	>
		Adapter refresh loading
	</button>

	<button
		data-testid="adapter-refreshed-ready-button"
		onclick={() => applyQuery({
			data: 'Refreshed value',
			isLoading: false,
			isError: false,
			isReady: true,
			status: 'ready',
		})}
	>
		Adapter refreshed ready
	</button>

	<button
		data-testid="adapter-error-button"
		onclick={() => applyQuery({
			data: '',
			isLoading: false,
			isError: true,
			isReady: false,
			error: 'Adapter failure',
			status: 'error',
		})}
	>
		Adapter error
	</button>

	<button
		data-testid="adapter-recover-loading-button"
		onclick={() => applyQuery({
			data: '',
			isLoading: true,
			isError: false,
			isReady: false,
			status: 'loading',
		})}
	>
		Adapter recover loading
	</button>

	<button
		data-testid="adapter-recovered-ready-button"
		onclick={() => applyQuery({
			data: 'Recovered value',
			isLoading: false,
			isError: false,
			isReady: true,
			status: 'ready',
		})}
	>
		Adapter recovered ready
	</button>

	<button
		data-testid="adapter-disabled-ready-button"
		onclick={() => applyQuery({
			data: 'Disabled value',
			isLoading: false,
			isError: false,
			isReady: true,
			status: 'disabled',
		})}
	>
		Adapter disabled ready
	</button>

	<dl>
		<dt>current</dt>
		<dd data-testid="adapter-current">{resource.current ?? ''}</dd>

		<dt>loading</dt>
		<dd data-testid="adapter-loading">{String(resource.loading)}</dd>

		<dt>ready</dt>
		<dd data-testid="adapter-ready">{String(resource.ready)}</dd>

		<dt>error</dt>
		<dd data-testid="adapter-error">{resource.error === undefined ? '' : String(resource.error)}</dd>
	</dl>
</section>
