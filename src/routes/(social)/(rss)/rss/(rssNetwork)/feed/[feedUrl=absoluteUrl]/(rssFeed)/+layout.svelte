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
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


{#key params.feedUrl}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
				{
					feedUrl: params.feedUrl,
				}
			)
		}
	>
		{#snippet Summary()}
			<RssFeedView
				selection={
					select(EntityType.RssFeed, data.selector, { sources: [
						Source.Rss_Rest,
						Source.Rss2Json_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(rss)/rss/(rssNetwork)/feed/[feedUrl=absoluteUrl]',
						{
							feedUrl: params.feedUrl,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
