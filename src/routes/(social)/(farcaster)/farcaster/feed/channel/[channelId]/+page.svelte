<script lang="ts">
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterFeedView from '$/views/FarcasterFeedView.svelte'
</script>


<Page>
	<FarcasterFeedView
		selector={{
			variant: 'byChannel',
			channelId: params.channelId,
		}}
		limit={50}
	/>
</Page>
