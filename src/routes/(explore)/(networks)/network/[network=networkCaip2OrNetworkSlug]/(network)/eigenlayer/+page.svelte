<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EigenLayerProtocol, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.EigenExplorer_Rest,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EigenLayerProtocolView from '$/views/EigenLayerProtocolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'eigen layer protocol' : pageSelection.entity.protocolName || 'eigen layer protocol')} • eigen layer protocol • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'eigen layer protocol'} • eigen layer protocol • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EigenLayerProtocolView
		selection={pageSelection}
	/>
	{/if}
</Page>
