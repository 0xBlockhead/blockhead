<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
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
		entityFieldReference={{
			entityType: EntityType.RedditLink,
			entityId,
			fieldName: '$$comments',
		}}
		href={resolve('/(social)/(reddit)/reddit/link/[fullname]/(link)/comments', {
			fullname: encodeURIComponent(entityId.fullname),
		})}
		id="reddit-link-comments"
	/>
</Page>
