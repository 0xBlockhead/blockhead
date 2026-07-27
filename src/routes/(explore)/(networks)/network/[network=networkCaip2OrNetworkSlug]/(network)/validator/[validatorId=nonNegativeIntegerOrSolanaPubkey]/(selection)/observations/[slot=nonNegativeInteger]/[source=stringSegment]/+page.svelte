<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.BeaconValidator_Timestamp, {
		$validator: data.selector,
		slot: Number(params.slot),
		source: params.source,
	}, {
		sources: [({
			$validator: data.selector,
			slot: Number(params.slot),
			source: params.source,
		}).source],
		fields: {
			status: true,
			balanceGwei: true,
			effectiveBalanceGwei: true,
			slashed: true,
			activationEligibilityEpoch: true,
			activationEpoch: true,
			exitEpoch: true,
			withdrawableEpoch: true,
			withdrawalCredentials: true,
			finalized: true,
			executionOptimistic: true,
			timestampMs: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconValidator_TimestampView from '$/views/BeaconValidator_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ((String(pageSelection.entitySelector.slot ?? '') ? 'Slot #' + String(pageSelection.entitySelector.slot ?? '') : '') || 'beacon validator timestamp'))} • beacon validator timestamp • Blockhead</title>
</svelte:head>


<Page>
	<BeaconValidator_TimestampView
		selection={pageSelection}
	/>
</Page>
