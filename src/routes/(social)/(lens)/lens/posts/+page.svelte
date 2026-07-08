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
	import LensPostsView from '$/views/LensPostsView.svelte'
</script>


<svelte:head>
	<title>Lens posts • Blockhead</title>
</svelte:head>


<Page>
	<LensPostsView
		href={resolve('/(social)/(lens)/lens/posts')}
		title='Lens posts'
		selection={
			select(EntityType.LensNetwork, {
				scope: 'LensNetwork',
			}).$$lensPosts({
				sources: [
					Source.Lens_Graphql,
				],
			})
		}
		id='lens-posts'
	/>
</Page>
