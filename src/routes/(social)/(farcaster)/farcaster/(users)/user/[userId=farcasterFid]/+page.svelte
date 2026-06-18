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
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<Page>
	<FarcasterUserView
		selector={{ fid: Number(params.userId) }}
	/>

	<section>
		<FarcasterCastsView
			href={resolve(`/farcaster/feed/user/${params.userId}`)}
			selection={select(
			EntityType.FarcasterFeed,
			{
					variant: 'byUser',
					fid: Number(params.userId),
				}
		).$$entries}
			id="casts"
			title="Feed"
			limit={50}
		/>
	</section>
</Page>
