<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.FarcasterFeed, {
			variant: 'byChannel',
			channelId: params.channelId,
		})}
		limit={50}
	/>
</Page>
