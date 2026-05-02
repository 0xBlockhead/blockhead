<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()

	const channelFeedId = $derived(
		({
			variant: 'byChannel' as const,
			channelId: params.channelId,
		}) satisfies EntityId<typeof schema, EntityType.FarcasterFeed>,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
</script>


<Page>
	<FarcasterChannelView
		entityId={{ id: params.channelId }}
		href={resolve(
			'/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]',
			params,
		)}
	>
		{#snippet children()}
			<section>
				<FarcasterCastsView
					entityFieldReference={{
						entityType: EntityType.FarcasterFeed,
						entityId: channelFeedId,
						fieldName: '$$entries',
					}}
					id="casts"
					title="Feed"
					href={resolve(`/farcaster/feed/channel/${encodeURIComponent(params.channelId)}`)}
					limit={50}
				/>
			</section>
		{/snippet}
	</FarcasterChannelView>
</Page>
