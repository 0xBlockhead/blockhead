<script lang="ts">
	import { applicationRuntimeWhenReady } from './applicationRuntime.ts'

	import ApplicationBootstrap from './ApplicationBootstrap.svelte'


	let {
		client,
		onMount,
		onDestroy,
	}: {
		client: Promise<{ id: string }>
		onMount: (id: string) => void
		onDestroy: () => void
	} = $props()

	const applicationRuntime = $derived(
		applicationRuntimeWhenReady(
			client,
			(readyClient) => {
				onMount(readyClient.id)

				return {
					destroy: onDestroy,
				}
			}
		)
	)

	$effect(() => applicationRuntime.destroy)
</script>


<nav aria-label="Application chrome">
	Chrome
</nav>

<main>
	<ApplicationBootstrap ready={applicationRuntime.ready}>
		<h1>
			Route child
		</h1>
	</ApplicationBootstrap>
</main>
