<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<Page>
	<LightningNodeView
		selector={{
			$network: { networkSlug: params.networkSlug },
			publicKey: params.pubkey,
		}}
	/>
</Page>
