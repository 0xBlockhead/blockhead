<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// Props
	let { children } = $props()

	const feedUrl = $derived(
		decodeURIComponent(page.params.feedKey ?? '').trim(),
	)


	// Components
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
			entityId={{ feedUrl }}
			href={resolve('/(social)/(rss)/rss/feed/[feedKey]', {
				feedKey: encodeURIComponent(feedUrl),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
