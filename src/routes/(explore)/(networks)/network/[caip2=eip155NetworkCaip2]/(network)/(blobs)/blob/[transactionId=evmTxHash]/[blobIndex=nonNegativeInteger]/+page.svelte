<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<Page>
	<EvmBlobView
		selector={{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			txHash: ZeroExHex.assert(params.transactionId.toLowerCase()),
			blobIndex: Number(params.blobIndex),
		}}
	/>
</Page>
