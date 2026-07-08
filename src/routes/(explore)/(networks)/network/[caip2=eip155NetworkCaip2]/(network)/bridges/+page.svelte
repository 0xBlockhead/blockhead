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
	import EvmNetworkBridgesView from '$/views/EvmNetworkBridgesView.svelte'
</script>


<svelte:head>
	<title>Bridges • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkBridgesView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges', {
				caip2: params.caip2,
			})
		}
		title='Bridges'
		selection={
			select(EntityType.Network, {
				caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
			}).Evm.$$bridges
		}
		id='bridges'
	/>
</Page>
