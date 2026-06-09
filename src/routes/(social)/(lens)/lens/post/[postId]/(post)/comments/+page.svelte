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
	import LensCommentsView from '$/views/LensCommentsView.svelte'
</script>


<Page>
	<LensCommentsView
		href={resolve('/lens')}
		entityFieldReference={{
			entityType: EntityType.LensPost,
			entityId: {
				id: decodeURIComponent(params.postId),
			},
			fieldName: '$$comments',
		}}
		id="lens-post-comments"
	/>
</Page>
