<script lang="ts">
	// Types/constants
	import { networkIdFromEvmChainId } from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


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
				$network: networkIdFromEvmChainId(Number(params.chainId)),
				type: CoinInstanceType.Erc20Token,
				$contract: {
					$network: networkIdFromEvmChainId(Number(params.chainId)),
					address: params.coin as `0x${string}`,
				},
			},
		}}
	/>
</Page>
