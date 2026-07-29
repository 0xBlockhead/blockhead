<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmNetworkBridge, data.selector, {
		fields: {
			relationshipType: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.url || 'EVM network bridge')} • EVM network bridge • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkBridgeView
		selection={pageSelection}
	/>
</Page>
