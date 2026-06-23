<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const postId = $derived(
		page.params.postId ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(lens)/lens/post/[postId]', {
		postId: encodeURIComponent(postId),
	})}
	id={postId}
>
	{#snippet Summary({ open: _open })}
		<LensPostView
			selection={
				select(
					EntityType.LensPost,
					{
						id: decodeURIComponent(postId),
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
