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

	const pageSelection = $derived(select(EntityType.CardanoBlock, data.selector, {
		fields: {
			hash: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoBlockView from '$/views/CardanoBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Cardano block' : pageSelection.entity.hash || 'Cardano block')} • Cardano block • Blockhead</title>
</svelte:head>


<Page>
	<CardanoBlockView
		selection={pageSelection}
	/>
</Page>
