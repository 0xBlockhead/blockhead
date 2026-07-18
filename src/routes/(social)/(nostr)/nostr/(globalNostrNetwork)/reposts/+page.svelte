<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<svelte:head>
	<title>Nostr reposts • Blockhead</title>
</svelte:head>


<Page>
	<NostrRepostsView
		href={resolve('/nostr/reposts')}
		title='Nostr reposts'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			}).$$observedReposts({
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
				count: true,
			})
		}
		id='observed-reposts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
