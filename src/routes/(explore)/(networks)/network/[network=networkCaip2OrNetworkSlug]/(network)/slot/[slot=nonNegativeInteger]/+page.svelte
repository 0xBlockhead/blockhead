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

	const pageSelection = $derived(select(EntityType.BeaconSlot, data.selector, {
		fields: {
			$epoch: true,
			proposerIndex: true,
			root: true,
			canonical: true,
			parentRoot: true,
			stateRoot: true,
			bodyRoot: true,
			signature: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? (String((data.selector.slot) ?? '') ? 'Slot #' + String((data.selector.slot) ?? '') : '') || 'beacon slot' : (String((({ ...data.selector, ...pageSelection.entity }).slot) ?? '') ? 'Slot #' + String((({ ...data.selector, ...pageSelection.entity }).slot) ?? '') : '') || 'beacon slot'))} • beacon slot • Blockhead</title>
</svelte:head>


<Page>
	<BeaconSlotView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
				network: params.network,
				slot: params.slot,
			})
		}
		selection={pageSelection}
	/>
</Page>
