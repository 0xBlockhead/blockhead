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
	import BlockheadSourceEndpointView from '$/views/BlockheadSourceEndpointView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSourceEndpoint, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.Local_Internal,
				],
				fields: {
					endpointUrl: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'source endpoint' : pageSelection.entity.endpointUrl || 'source endpoint')} • source endpoint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'source endpoint'} • source endpoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSourceEndpoint, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.Local_Internal,
				],
				fields: {
					endpointUrl: true,
				},
			})}

	<BlockheadSourceEndpointView
		selection={pageSelection}
	/>
	{/if}
</Page>
