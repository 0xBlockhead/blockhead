<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<Page>
	<EvmLogView
		selection={select(EntityType.EvmLog, {
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			txHash: ZeroExHex.assert(params.transactionId.toLowerCase()),
			logIndex: Number(params.logIndex),
		})}
	/>
</Page>
