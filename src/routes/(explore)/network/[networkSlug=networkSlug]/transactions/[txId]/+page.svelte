<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<Page>
	<UtxoTransactionView
		entityId={{
			$network: { networkSlug: params.networkSlug },
			txId: params.txId,
		}}
	/>
</Page>
