<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


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
			select(EntityType.EvmNetworkBridge, {
				$fromNetwork: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				$toNetwork: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.toCaip2)),
				},
				url: decodeURIComponent(params.url),
			}, {
				fields: {
					relationshipType: true,
				},
			})
		}
	/>
</Page>
