<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()

	const fullname = $derived(
		page.params.fullname ?? '',
	)


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(reddit)/reddit/comment/[fullname]', {
		fullname: encodeURIComponent(fullname),
	})}
	id={fullname}
>
	{#snippet Summary({ open: _open })}
		<RedditCommentView
			entityId={{ fullname: decodeURIComponent(fullname) }}
			href={resolve('/(social)/(reddit)/reddit/comment/[fullname]', {
				fullname: encodeURIComponent(fullname),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
