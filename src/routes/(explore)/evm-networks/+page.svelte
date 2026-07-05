<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworksView from '$/views/EvmNetworksView.svelte'
</script>


<svelte:head>
	<title>EVM networks • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworksView
		href={resolve('/(explore)/evm-networks')}
		title='EVM networks'
		selection={
			select(EntityType._Global, {
				scope: '$$evmNetworks',
			})[EntityProxyField]<EntityType.EvmNetwork>('$$evmNetworks')
		}
		id='evm-networks'
	/>
</Page>
