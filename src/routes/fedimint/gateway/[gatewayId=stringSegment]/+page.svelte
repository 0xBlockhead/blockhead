<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FedimintGateway, data.selector, {
					sources: [
						Source.FedimintGatewayd_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.gatewayId || 'Fedimint gateway')} • Fedimint gateway • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Fedimint gateway'} • Fedimint gateway • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FedimintGateway, data.selector, {
					sources: [
						Source.FedimintGatewayd_Rest,
					],
				}))}

		<FedimintGatewayView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
