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

	const pageSelection = $derived(select(EntityType.MevRelay_ProposerPayloadDelivered, {
		$relay: data.selector,
		slot: Number(params.slot),
		blockHash: params.blockHash,
	}, {
		fields: {
			value: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_ProposerPayloadDeliveredView from '$/views/MevRelay_ProposerPayloadDeliveredView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Slot ' + String(pageSelection.entitySelector.slot ?? '') : ['Slot ' + String(pageSelection.entitySelector.slot), String(pageSelection.entity.value) + ' wei'].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')} • MEV relay proposer payload delivered • Blockhead</title>
</svelte:head>


<Page>
	<MevRelay_ProposerPayloadDeliveredView
		selection={pageSelection}
	/>
</Page>
