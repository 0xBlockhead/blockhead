<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

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
		href={resolve('/(assets)/(channels)/channel/[channelId]', params)}
	/>
</Page>
