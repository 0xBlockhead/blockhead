<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<svelte:head>
	<title>Lens posts • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.LensNetwork, {
		scope: 'LensNetwork',
	})
		.$$lensPosts({
			sources: [
				Source.Lens_Graphql,
			],
		})}

	<LensPostsView
		href={resolve('/(social)/(lens)/lens/(lensNetwork)/observations/posts')}
		title='Lens posts'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='lens-posts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
