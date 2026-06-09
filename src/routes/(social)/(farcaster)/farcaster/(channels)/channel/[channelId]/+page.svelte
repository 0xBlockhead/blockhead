<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
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
		entityId={{ id: params.channelId }}
	/>

	<section>
		<FarcasterCastsView
			href={resolve(
				`/farcaster/feed/channel/${encodeURIComponent(params.channelId)}`,
			)}
			entityFieldReference={{
				entityType: EntityType.FarcasterFeed,
				entityId: {
					variant: 'byChannel',
					channelId: params.channelId,
				},
				fieldName: '$$entries',
			}}
			id="casts"
			title="Feed"
			limit={50}
		/>
	</section>
</Page>
