<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let { params } = $props()

	const userFeedId = $derived(
		({
			variant: 'byUser' as const,
			fid: Number(params.userId),
		}) satisfies EntityId<typeof schema, EntityType.FarcasterFeed>,
	)


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
	<FarcasterUserView
		entityId={{ fid: Number(params.userId) }}
		href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', params)}
	>
		{#snippet children()}
			<section>
				<FarcasterCastsView
					entityFieldReference={{
						entityType: EntityType.FarcasterFeed,
						entityId: userFeedId,
						fieldName: '$$entries',
					}}
					id="casts"
					title="Feed"
					href={resolve(`/farcaster/feed/user/${params.userId}`)}
					limit={50}
				/>
			</section>
		{/snippet}
	</FarcasterUserView>
</Page>
