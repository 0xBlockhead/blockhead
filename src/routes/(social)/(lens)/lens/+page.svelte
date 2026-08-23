<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensNetworkView from '$/views/LensNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Lens' : pageSelection.entity.protocolName || 'Lens')} • Lens • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lens'} • Lens • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LensNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					protocolName: true,
				},
			})}

	<LensNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
