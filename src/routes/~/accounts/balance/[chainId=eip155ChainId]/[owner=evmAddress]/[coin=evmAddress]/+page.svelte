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
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<svelte:head>
	<title>balance • Blockhead</title>
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
		selection={
			select(EntityType.EvmNetworkActorCoinBalance, data.selector, {
				fields: {
					symbol: true,
					$coinInstance: true,
					decimals: true,
				},
			})
		}
	/>
</Page>
