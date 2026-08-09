<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalance_EvmBlockView from '$/views/EvmNetworkActorCoinBalance_EvmBlockView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'EVM network actor coin balance EVM block'} • EVM network actor coin balance EVM block • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkActorCoinBalance_EvmBlockView
		selection={
			select(EntityType.EvmNetworkActorCoinBalance_EvmBlock, {
				$actorCoin: data.selector,
				$block: {
					$network: data.selector.$network,
					blockNumber: BigInt(params.blockNumber),
				},
			})
		}
	/>
</Page>
