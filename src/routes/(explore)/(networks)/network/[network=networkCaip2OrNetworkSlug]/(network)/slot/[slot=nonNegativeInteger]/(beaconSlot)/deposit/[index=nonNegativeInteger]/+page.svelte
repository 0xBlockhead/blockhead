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

	const pageSelection = $derived(select(EntityType.BeaconDeposit, {
		$network: data.selector,
		slot: Number(params.slot),
		indexInSlot: Number(params.index),
	}, {
		fields: {
			pubkey: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconDepositView from '$/views/BeaconDepositView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? `Deposit #${pageSelection.entitySelector.indexInSlot}` : (String(pageSelection.entitySelector.indexInSlot ?? '') ? 'Deposit #' + String(pageSelection.entitySelector.indexInSlot ?? '') : '') || 'beacon deposit')} • beacon deposit • Blockhead</title>
</svelte:head>


<Page>
	<BeaconDepositView
		selection={pageSelection}
	/>
</Page>
