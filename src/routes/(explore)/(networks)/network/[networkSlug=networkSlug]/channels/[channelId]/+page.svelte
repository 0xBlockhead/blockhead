<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<Page>
	<LightningChannelView
		entityId={{
			$network: { networkSlug: params.networkSlug },
			channelId: params.channelId,
		}}
	/>
</Page>
