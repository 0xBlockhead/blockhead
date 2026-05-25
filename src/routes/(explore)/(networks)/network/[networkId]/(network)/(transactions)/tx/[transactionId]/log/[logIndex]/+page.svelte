<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<Page>
	<EvmLogView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			txHash: params.transactionId as `0x${string}`,
			logIndex: Number(params.logIndex),
		}}
	/>
</Page>
