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

	const pageSelection = $derived(select(EntityType.BnbBeaconTokenTransfer, {
		$transaction: data.selector,
		transferIndex: Number(params.transferIndex),
	}, {
		fields: {
			symbol: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BnbBeaconTokenTransferView from '$/views/BnbBeaconTokenTransferView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'bnb beacon token transfer' : pageSelection.entity.symbol || 'bnb beacon token transfer')} • bnb beacon token transfer • Blockhead</title>
</svelte:head>


<Page>
	<BnbBeaconTokenTransferView
		selection={pageSelection}
	/>
</Page>
