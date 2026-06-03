<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const name = $derived(
		page.params.name ?? '',
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(reddit)/reddit/r/[name]', {
		name: encodeURIComponent(name),
	})}
	id={name}
>
	{#snippet Summary({ open: _open })}
		<RedditSubredditView
			entityId={{ name: decodeURIComponent(name).toLowerCase() }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
