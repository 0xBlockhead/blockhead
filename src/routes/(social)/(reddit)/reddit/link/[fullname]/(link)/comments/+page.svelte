<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ fullname: decodeURIComponent(params.fullname) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
</script>


<Page>
	<RedditCommentsView
		href={resolve('/reddit/comments')}
		entityFieldReference={{
			entityType: EntityType.RedditLink,
			entityId,
			fieldName: '$$comments',
		}}
		id="reddit-link-comments"
	/>
</Page>
