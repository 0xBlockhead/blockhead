<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<svelte:head>
	<title>AT Protocol posts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalAtprotoNetwork, {
		scope: '_GlobalAtprotoNetwork',
	})
		.$$observedPosts({
			sources: [
				Source.Constants_Internal,
			],
		})}

	<AtprotoPostsView
		href={resolve('/(social)/(atproto)/atproto/(globalAtprotoNetwork)/posts')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-posts'
	/>
</Page>
