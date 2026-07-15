<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BeaconCommittee, {
		$network: data.selector,
		slot: Number(params.slot),
		indexInSlot: Number(params.index),
	}, {
		fields: {
			validatorIndices: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInSlot) ?? '') ? 'Committee #' + String((pageSelection.entitySelector.indexInSlot) ?? '') : '') || 'beacon committee' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') ? 'Committee #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInSlot) ?? '') : '') || 'beacon committee')))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconCommitteeView from '$/views/BeaconCommitteeView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • beacon committee • Blockhead</title>
</svelte:head>


<Page>
	<BeaconCommitteeView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
				network: params.network,
				slot: params.slot,
				index: params.index,
			})
		}
		selection={pageSelection}
	/>
</Page>
