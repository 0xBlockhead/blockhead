<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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


{#key [params.feedKey, params.guid].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/rss/item/[feedKey=stringSegment]/[guid=stringSegment]', {
				feedKey: params.feedKey,
				guid: params.guid,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = RssItemView}

			<DetailView
				selection={select(EntityType.RssItem, data.selector)}
				href={
					resolve('/rss/item/[feedKey=stringSegment]/[guid=stringSegment]', {
						feedKey: params.feedKey,
						guid: params.guid,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
