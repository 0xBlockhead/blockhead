<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<Page>
	<EvmLogView
		entityId={{
			$network: { chainId: evmChainIdFromCaip2RouteParams(params) },
			txHash: params.transactionId as `0x${string}`,
			logIndex: Number(params.logIndex),
		}}
	/>
</Page>
