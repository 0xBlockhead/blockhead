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
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<Page>
	<RedditCommentsView
		href={resolve('/reddit/comments')}
		entityFieldReference={{
			entityType: EntityType.RedditComment,
			selector: {
				fullname: decodeURIComponent(params.fullname),
			},
			fieldName: '$$replies',
		}}
		id="reddit-comment-replies"
		sortMode="createdAtAsc"
		title="Replies"
	/>
</Page>
