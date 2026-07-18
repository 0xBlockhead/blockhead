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
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<svelte:head>
	<title>Nostr reactions • Blockhead</title>
</svelte:head>


<Page>
	<NostrReactionsView
		href={resolve('/nostr/reactions')}
		title='Nostr reactions'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			}).$$observedReactions({
				sources: [
					Source.NostrBand_Rest,
					Source.Primal_Rest,
				],
				count: true,
			})
		}
		id='observed-reactions'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
