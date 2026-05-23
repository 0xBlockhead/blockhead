<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ name: decodeURIComponent(params.name).toLowerCase() },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<Page>
	<RedditLinksView
		entityFieldReference={{
			entityType: EntityType.RedditSubreddit,
			entityId,
			fieldName: '$$links',
		}}
		href={resolve('/(social)/(reddit)/reddit/r/[name]/(subreddit)/links', {
			name: encodeURIComponent(entityId.name),
		})}
		id="reddit-subreddit-links"
	/>
</Page>
