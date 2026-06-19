<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { with0xHex } from '$/lib/hexLowerOfByteSize.ts'


	// State
	let {
		params,
	} = $props()

	const networkSelector = $derived(eip155NetworkSelectorFromCaip2(params.caip2))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<Page>
	<EvmContractView
		selection={select(EntityType.EvmContract, {
			$network: networkSelector,
			address: with0xHex(params.address),
		})}
	/>
</Page>
