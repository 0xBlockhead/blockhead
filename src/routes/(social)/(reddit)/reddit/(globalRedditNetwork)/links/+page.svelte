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
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<svelte:head>
	<title>Popular submissions • Blockhead</title>
</svelte:head>


<Page>
	<RedditLinksView
		href={resolve('/reddit/links')}
		title='Popular submissions'
		selection={
			select(EntityType._GlobalRedditNetwork, {
				scope: '_GlobalRedditNetwork',
			})
				.$$observedLinks({
					sources: [
						Source.Reddit_PublicJson,
					],
				})
		}
		countResource={
			select(EntityType._GlobalRedditNetwork, {
				scope: '_GlobalRedditNetwork',
			})
				.$$observedLinks({
					sources: [
						Source.Reddit_PublicJson,
					],
				}).count
		}
		id='observed-links'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
