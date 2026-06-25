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
	import LensCommentsView from '$/views/LensCommentsView.svelte'
</script>


<Page>
	<LensCommentsView
		href={resolve('/lens')}
		selection={select(
			EntityType.LensPost,
			{
				id: decodeURIComponent(params.postId),
			}
		).$$comments}
		id="lens-post-comments"
	/>
</Page>
