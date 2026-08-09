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

	const pageSelection = $derived(select(EntityType.FedimintGateway, data.selector, {
		sources: [
			Source.FedimintGatewayd_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FedimintGatewayView from '$/views/FedimintGatewayView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.gatewayId || 'Fedimint gateway')} • Fedimint gateway • Blockhead</title>
</svelte:head>


<Page>
	<FedimintGatewayView
		selection={pageSelection}
	/>
</Page>
