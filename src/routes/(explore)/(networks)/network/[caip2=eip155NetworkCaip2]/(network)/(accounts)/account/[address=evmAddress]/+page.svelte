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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
</script>


<Page>
	<EvmNetworkAccountView
		selection={select(EntityType.EvmNetworkAccount, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			$actor: {
				address: with0xHex(params.address),
			},
		})}
	/>
</Page>
