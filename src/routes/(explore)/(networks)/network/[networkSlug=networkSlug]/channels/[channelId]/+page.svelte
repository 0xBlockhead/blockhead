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
		selector={{
			$network: { slug: params.networkSlug },
			channelId: params.channelId,
		}}
	/>
</Page>
