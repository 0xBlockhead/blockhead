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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


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
			select(EntityType.EvmNetworkActorCoinBalance, {
				$actor: {
					interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.owner),
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
					Source.Allium_Rest,
				],
				fields: {
					symbol: true,
					$coinInstance: true,
					decimals: true,
				},
			})
		}
	/>
</Page>
