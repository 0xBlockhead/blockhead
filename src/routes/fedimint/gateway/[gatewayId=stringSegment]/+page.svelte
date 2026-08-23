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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.FedimintGateway, data.selector, {
		sources: [
			Source.FedimintGatewayd_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintGatewayView from '$/views/FedimintGatewayView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.gatewayId || 'Fedimint gateway')} • Fedimint gateway • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Fedimint gateway'} • Fedimint gateway • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<FedimintGatewayView
		selection={pageSelection}
	/>
	{/if}
</Page>
