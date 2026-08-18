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

	const pageSelection = $derived(select(EntityType.CardanoAddress, data.selector, {
		sources: [
			Source.Blockfrost_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CardanoAddressView from '$/views/CardanoAddressView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.address || 'Cardano address')} • Cardano address • Blockhead</title>
</svelte:head>


<Page>
	<CardanoAddressView
		selection={pageSelection}
	/>
</Page>
