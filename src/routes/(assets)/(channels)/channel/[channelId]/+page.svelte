<script lang="ts">
	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import StateChannelView from '$/views/StateChannelView.svelte'
</script>


<Page>
	<StateChannelView
		entityId={{ id: params.channelId }}
	/>
</Page>
