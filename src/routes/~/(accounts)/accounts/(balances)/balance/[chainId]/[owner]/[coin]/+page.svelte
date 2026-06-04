<script lang="ts">
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
		entityId={{
			$actor: {
				address: params.owner as `0x${string}`,
			},
			$coinInstance: {
				$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
				type: CoinInstanceType.Erc20Token,
				$contract: {
					$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
					address: params.coin as `0x${string}`,
				},
			},
		}}
	/>
</Page>
