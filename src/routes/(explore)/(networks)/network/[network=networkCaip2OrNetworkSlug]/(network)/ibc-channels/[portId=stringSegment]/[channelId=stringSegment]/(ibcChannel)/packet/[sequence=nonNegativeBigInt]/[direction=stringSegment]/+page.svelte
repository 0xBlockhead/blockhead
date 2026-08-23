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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IbcPacket, {
		$channel: data.selector,
		sequence: BigInt(params.sequence),
		direction: params.direction,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcPacketView from '$/views/IbcPacketView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.sequence ?? '') ? 'Packet #' + String(pageSelection.entitySelector.sequence ?? '') : '') || 'IBC packet')} • IBC packet • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IBC packet'} • IBC packet • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IbcPacketView
		selection={pageSelection}
	/>
	{/if}
</Page>
