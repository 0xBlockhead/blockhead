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

	const pageSelection = $derived(select(EntityType.BnbBeaconTransaction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTransactionView from '$/views/BnbBeaconTransactionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.txHash || 'bnb beacon transaction')} • bnb beacon transaction • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconTransactionView
		selection={pageSelection}
	/>
</Page>
