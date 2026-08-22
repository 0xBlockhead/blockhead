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

	const pageSelection = $derived(select(EntityType.AlgorandTransaction, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import AlgorandTransactionView from '$/views/AlgorandTransactionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.txId || 'algorand transaction')} • algorand transaction • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandTransactionView
		selection={pageSelection}
	/>
</Page>
