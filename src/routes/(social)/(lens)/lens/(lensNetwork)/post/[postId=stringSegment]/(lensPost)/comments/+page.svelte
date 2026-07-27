<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<svelte:head>
	<title>Lens post comments • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LensPost, {
		id: params.postId,
	})
		.$$comments({
			sources: [
				Source.Lens_Graphql,
			],
		})}

	<LensPostsView
		href={
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/comments',
				{
					postId: String(params.postId),
				}
			)
		}
		title='Lens post comments'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='comments'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
