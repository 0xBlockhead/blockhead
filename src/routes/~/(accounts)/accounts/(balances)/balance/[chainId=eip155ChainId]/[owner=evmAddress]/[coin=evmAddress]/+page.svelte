<script lang="ts">
	// Functions
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
</script>


<Page>
	<EvmNetworkActorCoinBalanceView
		selector={{
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
		}}
	/>
</Page>
