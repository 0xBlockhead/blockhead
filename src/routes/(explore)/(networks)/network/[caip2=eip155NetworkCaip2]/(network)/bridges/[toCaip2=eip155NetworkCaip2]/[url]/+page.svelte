<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


<svelte:head>
	<title>EVM network bridge • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkBridgeView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges/[toCaip2=eip155NetworkCaip2]/[url]', {
				caip2: params.caip2,
				toCaip2: params.toCaip2,
				url: params.url,
			})
		}
		selection={
			select(EntityType.EvmNetworkBridge, data.selector, {
				fields: {
					relationshipType: true,
				},
			})
		}
	/>
</Page>
