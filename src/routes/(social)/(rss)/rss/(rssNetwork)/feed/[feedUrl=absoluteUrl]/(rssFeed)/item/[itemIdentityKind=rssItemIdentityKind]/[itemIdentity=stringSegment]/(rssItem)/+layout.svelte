<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
			{
				feedUrl: params.feedUrl,
				itemIdentityKind: params.itemIdentityKind,
				itemIdentity: params.itemIdentity,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.RssItem, data.selector, {
		sources: [
			Source.Rss_Rest,
			Source.Rss2Json_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<RssItemView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
