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

	const pageSelection = $derived(select(EntityType.CosmosMessage, {
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosMessageView from '$/views/CosmosMessageView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Message #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'Cosmos message')} • Cosmos message • Blockhead</title>
</svelte:head>


<Page>
	<CosmosMessageView
		selection={pageSelection}
	/>
</Page>
