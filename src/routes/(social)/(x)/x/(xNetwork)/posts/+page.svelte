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
	import XPostsView from '$/views/XPostsView.svelte'
</script>


<svelte:head>
	<title>X posts • Blockhead</title>
</svelte:head>


<Page>
	<XPostsView
		href={resolve('/x/posts')}
		title='X posts'
		selection={
			select(EntityType.XNetwork, {
				scope: 'XNetwork',
			}).$$xPosts({
				sources: [
					Source.X_FxEmbed_Rest,
				],
				count: true,
			})
		}
		id='x-posts'
	/>
</Page>
