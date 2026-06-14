<script lang="ts">
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
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
	<FarcasterUserView
		selector={{ fid: Number(params.userId) }}
	/>

	<section>
		<FarcasterCastsView
			href={resolve(`/farcaster/feed/user/${params.userId}`)}
			entityFieldReference={{
				entityType: EntityType.FarcasterFeed,
				selector: {
					variant: 'byUser',
					fid: Number(params.userId),
				},
				fieldName: '$$entries',
			}}
			id="casts"
			title="Feed"
			limit={50}
		/>
	</section>
</Page>
