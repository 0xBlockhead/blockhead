<script lang="ts">
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import Fixture from './resource-boundary-fixture.svelte'

	let { delivery, direct = false }: {
		delivery: Promise<{ resource: SvelteKitResource<string> }>
		direct?: boolean
	} = $props()
	let resource = $state<SvelteKitResource<string>>()

	$effect(() => {
		let active = true
		void delivery.then((value) => {
			if (active)
				resource = value.resource
		})
		return () => { active = false }
	})
</script>


{#if resource !== undefined}
	<Fixture {resource} {direct} />
{/if}
