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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BeaconWithdrawal, {
		$network: data.selector,
		slot: Number(params.slot),
		indexInSlot: Number(params.index),
	}, {
		sources: [
			Source.Beacon_Rest,
		],
		fields: {
			amountGwei: true,
			validatorIndex: true,
			$validator: true,
			$account: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconWithdrawalView from '$/views/BeaconWithdrawalView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInSlot ?? '') ? 'Withdrawal #' + String(pageSelection.entitySelector.indexInSlot ?? '') : '') || 'beacon withdrawal')} • beacon withdrawal • Blockhead</title>
</svelte:head>


<Page>
	<BeaconWithdrawalView
		selection={pageSelection}
	/>
</Page>
