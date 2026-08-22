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

	const pageSelection = $derived(select(EntityType.StarknetTransaction, data.selector, {
		sources: [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.transactionHash || 'starknet transaction')} • starknet transaction • Blockhead</title>
</svelte:head>


<Page>
	<StarknetTransactionView
		selection={pageSelection}
	/>
</Page>
