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
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<Page>
	<EvmActorCoinAllowanceView
		href={
			resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
				chainId: params.chainId,
				owner: params.owner,
				coin: params.coin,
				spender: params.spender,
			})
		}
		selection={
			select(EntityType.EvmActorCoinAllowance, {
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
				$spender: {
					interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.spender),
				},
				interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.owner),
			}, {
				sources: [
					Source.Voltaire_JsonRpc,
				],
				fields: {
					$actorCoin: true,
					$spenderContract: true,
				},
			})
		}
	/>
</Page>
