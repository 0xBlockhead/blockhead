<script lang="ts">
	// Types/constants
	import { networkIdFromEvmChainId } from '$/lib/caip.ts'


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
		entityId={{
			$actorCoin: {
				$actor: {
					address: params.owner as `0x${string}`,
				},
				$coinInstance: {
					$network: networkIdFromEvmChainId(Number(params.chainId)),
					type: CoinInstanceType.Erc20Token,
					$contract: {
						$network: networkIdFromEvmChainId(Number(params.chainId)),
						address: params.coin as `0x${string}`,
					},
				},
			},
			$spender: {
				address: params.spender as `0x${string}`,
			},
		}}
	/>
</Page>
