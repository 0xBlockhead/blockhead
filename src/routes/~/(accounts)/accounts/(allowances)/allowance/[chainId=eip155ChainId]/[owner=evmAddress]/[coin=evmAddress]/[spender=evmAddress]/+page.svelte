<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { toEvmActorCoinAllowanceEntitySelector } from '$/schema/EvmActorCoinAllowance.ts'
	import { select } from '$/routes/+layout.svelte'
	// Functions
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<Page>
	<EvmActorCoinAllowanceView
		selection={select(EntityType.EvmActorCoinAllowance, toEvmActorCoinAllowanceEntitySelector(
			Number(params.chainId),
			with0xHex(params.owner),
			with0xHex(params.coin),
			with0xHex(params.spender),
		))}
	/>
</Page>
