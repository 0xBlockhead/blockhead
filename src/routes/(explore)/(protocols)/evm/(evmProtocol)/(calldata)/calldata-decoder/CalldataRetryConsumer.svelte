<script lang="ts">
	import type { CalldataRetryResource } from './calldataRetryResource.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

	let props = $props<{
		controller: CalldataRetryResource<{ value: string }>
		onObserve: (resource: SvelteKitResource<{ value: string }>) => void
	}>()
	let controller = $derived(props.controller)
	let observed = $state.raw<SvelteKitResource<{ value: string }>>()

	$effect(() => {
		const resource = controller.resource
		observed = resource
		props.onObserve(resource)
	})
</script>

<output aria-label="resource observation" data-resource={observed === controller.resource ? 'current' : 'stale'}></output>
