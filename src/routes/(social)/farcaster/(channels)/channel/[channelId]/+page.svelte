<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<Page>
	<FarcasterChannelView
		selection={select(EntityType.FarcasterChannel, { id: params.channelId })}
	/>

	<section>
		<FarcasterCastsView
			href={resolve(
				`/farcaster/feed/channel/${encodeURIComponent(params.channelId)}`,
			)}
			selection={select(
			EntityType.FarcasterFeed,
			{
					variant: 'byChannel',
					channelId: params.channelId,
				}
		).$$entries}
			id="casts"
			title="Feed"
			limit={50}
		/>
	</section>
</Page>
