<script lang="ts">
	// Types/constants
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { params } = $props()


	// (Derived)
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
	/>

	<section>
		<FarcasterCastsView
			href={resolve(`/farcaster/feed/user/${params.userId}`)}
			entityFieldReference={{
				entityType: EntityType.FarcasterFeed,
				entityId: userFeedId,
				fieldName: '$$entries',
			}}
			id="casts"
			title="Feed"
			limit={50}
		/>
	</section>
</Page>
