<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<Page>
	<RedditCommentsView
		href={resolve('/reddit/comments')}
		selection={select(
			EntityType.RedditComment,
			{
				fullname: decodeURIComponent(params.fullname),
			}
		).$$replies}
		id="reddit-comment-replies"
		sortMode="createdAtAsc"
		title="Replies"
	/>
</Page>
