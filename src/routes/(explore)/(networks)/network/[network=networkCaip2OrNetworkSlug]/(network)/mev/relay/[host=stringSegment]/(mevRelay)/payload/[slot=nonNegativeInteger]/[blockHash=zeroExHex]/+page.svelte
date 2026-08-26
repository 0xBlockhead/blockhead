<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MevRelay_ProposerPayloadDelivered, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Slot ' + String(pageSelection.entitySelector.slot ?? '') : ['Slot ' + String(pageSelection.entitySelector.slot), String(pageSelection.entity.value) + ' wei'].filter(Boolean).join(' ') || 'MEV relay proposer payload delivered')} • MEV relay proposer payload delivered • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'MEV relay proposer payload delivered'} • MEV relay proposer payload delivered • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MevRelay_ProposerPayloadDeliveredView
		selection={pageSelection}
	/>
	{/if}
</Page>
