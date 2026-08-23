<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosMessageView from '$/views/CosmosMessageView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CosmosMessage, {
				$transaction: data.selector,
				indexInTransaction: Number(params.indexInTransaction),
			})}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Message #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'Cosmos message')} • Cosmos message • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cosmos message'} • Cosmos message • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CosmosMessage, {
				$transaction: data.selector,
				indexInTransaction: Number(params.indexInTransaction),
			})}

	<CosmosMessageView
		selection={pageSelection}
	/>
	{/if}
</Page>
