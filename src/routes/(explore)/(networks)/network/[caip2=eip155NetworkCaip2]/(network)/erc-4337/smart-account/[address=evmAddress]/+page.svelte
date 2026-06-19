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
	import Erc4337SmartAccountView from '$/views/Erc4337SmartAccountView.svelte'
</script>


<Page>
	<Erc4337SmartAccountView
		selection={select(EntityType.Erc4337SmartAccount, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			address: with0xHex(params.address),
		})}
	/>
</Page>
