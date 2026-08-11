<script lang="ts" generics="
	Data extends {
		readonly name?: string,
	} | undefined
">
	// Types/constants
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'

	// State
	let {
		resource,
	}: {
		resource: SvelteKitResource<Data>
	} = $props()
</script>


<p data-testid="nested-resource-first-current">
	{resource.current?.name ?? ''}
</p>

<svelte:boundary>
	{@const resolvedSession = await resource}

	<p data-testid="nested-resource-first-promise">
		{resolvedSession?.name ?? ''}
	</p>

	{#snippet pending()}
		<p data-testid="nested-resource-first-promise"></p>
	{/snippet}
</svelte:boundary>
