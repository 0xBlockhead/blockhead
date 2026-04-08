<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<Page>
	<FarcasterCastsView
		id="feed"
		title="Feed"
		href={resolve('/farcaster/feed')}
		limit={50}
		parentEntityType={EntityType.FarcasterNetwork}
		parentEntityId={{
			scope: 'FarcasterNetwork',
		}}
	/>
</Page>
