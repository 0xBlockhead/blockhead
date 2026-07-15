<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInSlot) ?? '') ? 'Withdrawal #' + String((pageSelection.entitySelector.indexInSlot) ?? '') : '') || 'beacon withdrawal' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') ? 'Withdrawal #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') : '') || 'beacon withdrawal')))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconWithdrawalView from '$/views/BeaconWithdrawalView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • beacon withdrawal • Blockhead</title>
</svelte:head>


<Page>
	<BeaconWithdrawalView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/withdrawal/[index=nonNegativeInteger]', {
				network: params.network,
				slot: params.slot,
				index: params.index,
			})
		}
		selection={pageSelection}
	/>
</Page>
