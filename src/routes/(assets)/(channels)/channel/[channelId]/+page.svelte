<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import ChannelView from '$/views/ChannelView.svelte'
</script>


<Page>
	<ChannelView
		entityId={{ id: params.channelId }}
	/>
</Page>
