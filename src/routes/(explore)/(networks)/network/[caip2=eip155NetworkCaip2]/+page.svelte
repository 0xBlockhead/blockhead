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
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<svelte:head>
	<title>EVM network • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
				caip2: params.caip2,
			})
		}
		selection={
			select(EntityType.EvmNetwork, data.selector, {
				fields: {
					$icon: true,
					name: true,
					environment: true,
					$nativeCoinInstance: true,
					$parent: true,
					$mainnet: true,
					consensusProtocol: true,
					registryStatus: true,
					peeringId: true,
					slip44: true,
				},
			})
		}
	/>
</Page>
