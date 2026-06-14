<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const feedUrl = $derived(
		decodeURIComponent(page.params.feedKey ?? '').trim(),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(rss)/rss/feed/[feedKey]', {
		feedKey: encodeURIComponent(feedUrl),
	})}
	id={feedUrl}
>
	{#snippet Summary({ open: _open })}
		<RssFeedView
			selector={{ feedUrl }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
