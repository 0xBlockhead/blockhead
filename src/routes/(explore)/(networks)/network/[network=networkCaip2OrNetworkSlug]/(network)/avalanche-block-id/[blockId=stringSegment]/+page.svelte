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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.AvalanchePChainBlock, data.selector, {
		fields: {
			height: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AvalanchePChainBlockView from '$/views/AvalanchePChainBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.blockId ?? '') || 'avalanche p chain block' : String(pageSelection.entity.height) || pageSelection.entitySelector.blockId || 'avalanche p chain block')} • avalanche p chain block • Blockhead</title>
</svelte:head>


<Page>
	<AvalanchePChainBlockView
		selection={pageSelection}
	/>
</Page>
