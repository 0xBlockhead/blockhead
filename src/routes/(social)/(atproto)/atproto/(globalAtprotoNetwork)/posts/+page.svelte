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
	import AtprotoPostsView from '$/views/AtprotoPostsView.svelte'
</script>


<svelte:head>
	<title>AT Protocol posts • Blockhead</title>
</svelte:head>


<Page>
	<AtprotoPostsView
		href={resolve('/atproto/posts')}
		title='AT Protocol posts'
		selection={
			select(EntityType._GlobalAtprotoNetwork, {
				scope: '_GlobalAtprotoNetwork',
			}).$$observedPosts({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='observed-posts'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
