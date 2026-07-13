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
	let promiseState = $state('pending')
	let secondPromiseState = $state('pending')
	let catchState = $state('')
	let finallyCount = $state(0)

	const applyQuery = (
		nextQuery: TanStackLiveQuerySnapshot<string>,
	) => {
		query.data = nextQuery.data
		query.isLoading = nextQuery.isLoading
		query.isError = nextQuery.isError
		query.isReady = nextQuery.isReady
		query.error = nextQuery.error
		query.status = nextQuery.status
		promiseState = 'pending'
		secondPromiseState = 'pending'
		catchState = ''
		for (const listener of queryListeners)
			listener()
		void resource.then(
			(value) => {
				promiseState = value
			},
			(error) => {
				promiseState = String(error)
			},
		)
		void resource.then(
			(value) => {
				secondPromiseState = value
			},
			(error) => {
				secondPromiseState = String(error)
			},
		)
		void resource.catch((error) => {
			catchState = String(error)
		})
		void resource.finally(() => {
			finallyCount += 1
		}).catch(() => {})
	}
</script>


<h1>Query resource adapter promise test route</h1>

<section>
	<h2>TanStack adapter promise state machine</h2>

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

	<p data-testid="adapter-awaited">{promiseState}</p>
	<p data-testid="adapter-awaited-second">{secondPromiseState}</p>
	<p data-testid="adapter-catch">{catchState}</p>
	<p data-testid="adapter-finally-count">{finallyCount}</p>
	<dl>
		<dt>current</dt>
		<dd data-testid="adapter-direct-current">{resource.current ?? ''}</dd>

		<dt>loading</dt>
		<dd data-testid="adapter-direct-loading">{String(resource.loading)}</dd>

		<dt>ready</dt>
		<dd data-testid="adapter-direct-ready">{String(resource.ready)}</dd>

		<dt>error</dt>
		<dd data-testid="adapter-direct-error">{resource.error === undefined ? '' : String(resource.error)}</dd>
	</dl>
</section>
