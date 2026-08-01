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
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<svelte:head>
	<title>Profile reposts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.NostrProfile, data.selector).$$reposts}

	<NostrRepostsView
		href={
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]/(nostrProfile)/reposts',
				{
					pubkey: params.pubkey,
				}
			)
		}
		title='Profile reposts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='reposts'
	/>
</Page>
