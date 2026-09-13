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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FinancialProtocol, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FinancialProtocolView from '$/views/FinancialProtocolView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.protocolKey ?? '') || 'financial protocol' : pageSelection.entity.name || pageSelection.entitySelector.protocolKey || 'financial protocol')} • financial protocol • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'financial protocol'} • financial protocol • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FinancialProtocolView
		selection={pageSelection}
	/>
	{/if}
</Page>
