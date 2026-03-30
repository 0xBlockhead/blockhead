<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
</script>


<Page>
	<FarcasterChannelsView
		href={resolve('/farcaster/channels')}
		id="channels"
	/>
</Page>
