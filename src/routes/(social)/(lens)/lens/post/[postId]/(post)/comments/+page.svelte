<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ id: decodeURIComponent(params.postId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import LensCommentsView from '$/views/LensCommentsView.svelte'
</script>


<Page>
	<LensCommentsView
		entityFieldReference={{
			entityType: EntityType.LensPost,
			entityId,
			fieldName: '$$comments',
		}}
		href={resolve('/(social)/(lens)/lens/post/[postId]/(post)/comments', {
			postId: encodeURIComponent(entityId.id),
		})}
		id="lens-post-comments"
	/>
</Page>
