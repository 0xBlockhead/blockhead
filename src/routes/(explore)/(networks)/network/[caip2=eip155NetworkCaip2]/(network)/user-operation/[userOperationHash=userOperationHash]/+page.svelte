<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { select } from '$/routes/+layout.svelte'
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<Page>
	<EvmUserOperationView
		selection={select(EntityType.EvmUserOperation, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			hash: ZeroExHex.assert(params.userOperationHash.toLowerCase()),
		})}
	/>
</Page>
