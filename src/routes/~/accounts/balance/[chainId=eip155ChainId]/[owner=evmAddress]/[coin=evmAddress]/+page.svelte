<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
					reference: Number(params.chainId),
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
			decimals: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.symbol) ?? '')].filter(Boolean).join(' ') || 'balance' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).symbol) ?? '')].filter(Boolean).join(' ') || 'balance'))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • balance • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkActorCoinBalanceView
		href={
			resolve('/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]', {
				chainId: params.chainId,
				owner: params.owner,
				coin: params.coin,
			})
		}
		selection={pageSelection}
	/>
</Page>
