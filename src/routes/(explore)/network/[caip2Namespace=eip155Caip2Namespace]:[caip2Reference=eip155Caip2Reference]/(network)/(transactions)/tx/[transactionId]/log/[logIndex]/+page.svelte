<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<Page>
	<EvmLogView
		entityId={{
			$network: networkIdFromCaip2RouteParams(params),
			txHash: params.transactionId as `0x${string}`,
			logIndex: Number(params.logIndex),
		}}
	/>
</Page>
