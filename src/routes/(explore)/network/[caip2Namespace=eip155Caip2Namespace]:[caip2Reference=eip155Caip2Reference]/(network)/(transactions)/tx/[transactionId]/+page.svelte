<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTransactionView from '$/views/EvmTransactionView.svelte'
</script>


<Page>
		<EvmTransactionView
		entityId={{
			$network: networkIdFromCaip2RouteParams(params),
			txHash: params.transactionId as `0x${string}`,
		}}
	/>
</Page>

