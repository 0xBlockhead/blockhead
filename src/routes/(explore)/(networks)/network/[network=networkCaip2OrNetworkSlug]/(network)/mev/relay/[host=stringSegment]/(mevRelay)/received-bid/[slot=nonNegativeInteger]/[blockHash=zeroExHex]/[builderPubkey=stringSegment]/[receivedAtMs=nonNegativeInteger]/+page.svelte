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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MevRelay_BuilderBlockReceived, {
		$relay: data.selector,
		slot: Number(params.slot),
		$builder: {
			$network: data.selector.$network,
			builderPubkey: params.builderPubkey,
		},
		blockHash: params.blockHash,
		receivedAtMs: Number(params.receivedAtMs),
	}, {
		fields: {
			valueWei: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MevRelay_BuilderBlockReceivedView from '$/views/MevRelay_BuilderBlockReceivedView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Slot ' + String(pageSelection.entitySelector.slot ?? '') : ['Slot ' + String(pageSelection.entitySelector.slot), String(pageSelection.entity.valueWei) + ' wei'].filter(Boolean).join(' ') || 'MEV relay builder block received')} • MEV relay builder block received • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'MEV relay builder block received'} • MEV relay builder block received • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MevRelay_BuilderBlockReceivedView
		selection={pageSelection}
	/>
	{/if}
</Page>
