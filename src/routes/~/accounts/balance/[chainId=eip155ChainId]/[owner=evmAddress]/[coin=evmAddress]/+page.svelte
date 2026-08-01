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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmNetworkActorCoinBalance, {
		$actor: {
			interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.owner),
		},
		$contract: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			address: params.coin,
		},
	}, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			$coinInstance: true,
			$network: true,
			decimals: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'balance' : pageSelection.entity.symbol || 'balance'} • balance • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkActorCoinBalanceView
		selection={pageSelection}
	/>
</Page>
