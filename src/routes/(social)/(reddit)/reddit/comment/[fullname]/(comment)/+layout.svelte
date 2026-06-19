<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const fullname = $derived(
		page.params.fullname ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
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
			selection={select(EntityType.RedditComment, { fullname: decodeURIComponent(fullname) })}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
