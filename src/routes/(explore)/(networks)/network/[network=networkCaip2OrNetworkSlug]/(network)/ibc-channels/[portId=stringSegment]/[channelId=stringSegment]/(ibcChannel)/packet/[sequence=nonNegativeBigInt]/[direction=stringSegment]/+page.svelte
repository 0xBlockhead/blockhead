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

	const pageSelection = $derived(select(EntityType.IbcPacket, {
		$channel: data.selector,
		sequence: BigInt(params.sequence),
		direction: params.direction,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IbcPacketView from '$/views/IbcPacketView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? ((String(pageSelection.entitySelector.sequence ?? '') ? 'Packet #' + String(pageSelection.entitySelector.sequence ?? '') : '') || 'IBC packet')} • IBC packet • Blockhead</title>
</svelte:head>


<Page>
	<IbcPacketView
		selection={pageSelection}
	/>
</Page>
