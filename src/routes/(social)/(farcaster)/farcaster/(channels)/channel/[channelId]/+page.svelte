<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<Page>
	<FarcasterChannelView
		entityId={{ id: params.channelId }}
		href={resolve(
			'/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]',
			params,
		)}
	/>
</Page>
