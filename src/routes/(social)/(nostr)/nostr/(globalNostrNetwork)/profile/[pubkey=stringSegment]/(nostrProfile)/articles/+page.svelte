<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
</script>


<svelte:head>
	<title>Profile articles • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.NostrProfile, data.selector).$$articles}

	<NostrArticlesView
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/articles',
				{
					pubkey: params.pubkey,
				}
			)
		}
		title='Profile articles'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='articles'
	/>
</Page>
