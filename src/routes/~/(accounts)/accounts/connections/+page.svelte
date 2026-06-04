<script lang="ts">
	// Components
	import BlockheadWalletConnectionsView from '$/views/BlockheadWalletConnectionsView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<BlockheadWalletConnectionsView
		id="wallet-connections"
		open={true}
	/>
</Page>
