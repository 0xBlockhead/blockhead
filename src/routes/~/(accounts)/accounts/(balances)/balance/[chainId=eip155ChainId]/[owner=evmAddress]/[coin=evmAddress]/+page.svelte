<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Functions
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<Page>
	<EvmNetworkActorCoinBalanceView
		selection={select(EntityType.EvmNetworkActorCoinBalance, {
			$actor: {
				address: with0xHex(params.owner),
			},
			$contract: {
				$network: { caip2: { namespace: 'eip155' as const, reference: String(Number(params.chainId)) } },
				address: with0xHex(params.coin),
			},
		})}
	/>
</Page>
