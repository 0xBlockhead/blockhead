<script lang="ts">
	// Functions
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
</script>


<Page>
	<EvmActorCoinAllowanceView
		selector={{
			$actorCoin: {
				$actor: {
					address: with0xHex(params.owner),
				},
				$coinInstance: {
					$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
					type: CoinInstanceType.Erc20Token,
					$contract: {
						$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
						address: with0xHex(params.coin),
					},
				},
			},
			$spender: {
				address: with0xHex(params.spender),
			},
		}}
	/>
</Page>
