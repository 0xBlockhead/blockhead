<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()

	const postId = $derived(
		page.params.postId ?? '',
	)


	// Components
	import LensPostView from '$/views/LensPostView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(lens)/lens/post/[postId]', {
		postId: encodeURIComponent(postId),
	})}
	id={postId}
>
	{#snippet Summary({ open: _open })}
		<LensPostView
			entityId={{ id: decodeURIComponent(postId) }}
			href={resolve('/(social)/(lens)/lens/post/[postId]', {
				postId: encodeURIComponent(postId),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
