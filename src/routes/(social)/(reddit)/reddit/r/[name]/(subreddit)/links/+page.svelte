<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<Page>
	<RedditLinksView
		href={resolve('/reddit/links')}
		entityFieldReference={{
			entityType: EntityType.RedditSubreddit,
			entityId: {
				name: decodeURIComponent(params.name).toLowerCase(),
			},
			fieldName: '$$links',
		}}
		id="reddit-subreddit-links"
	/>
</Page>
