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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintGatewayView from '$/views/FedimintGatewayView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FedimintGateway, data.selector, {
				sources: [
					Source.FedimintGatewayd_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.gatewayId || 'Fedimint gateway')} • Fedimint gateway • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Fedimint gateway'} • Fedimint gateway • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.FedimintGateway, data.selector, {
				sources: [
					Source.FedimintGatewayd_Rest,
				],
			})}

	<FedimintGatewayView
		selection={pageSelection}
	/>
	{/if}
</Page>
