<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RssItemView from '$/views/RssItemView.svelte'
</script>


{#key [params.feedUrl, params.itemIdentityKind, params.itemIdentity].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
				{
					feedUrl: params.feedUrl,
					itemIdentityKind: params.itemIdentityKind,
					itemIdentity: params.itemIdentity,
				}
			)
		}
	>
		{#snippet Summary()}
			<RssItemView
				selection={
					select(EntityType.RssItem, data.selector, { sources: [
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]/(rssFeed)/item/[itemIdentityKind=rssItemIdentityKind]/[itemIdentity=stringSegment]',
						{
							feedUrl: params.feedUrl,
							itemIdentityKind: params.itemIdentityKind,
							itemIdentity: params.itemIdentity,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
