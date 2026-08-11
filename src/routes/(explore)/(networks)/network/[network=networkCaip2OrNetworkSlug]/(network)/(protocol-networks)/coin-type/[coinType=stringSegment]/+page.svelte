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

	const pageSelection = $derived(select(EntityType.SuiCoinType, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.coinType || 'Sui coin type')} • Sui coin type • Blockhead</title>
</svelte:head>


<Page>
	<SuiCoinTypeView
		selection={pageSelection}
	/>
</Page>
