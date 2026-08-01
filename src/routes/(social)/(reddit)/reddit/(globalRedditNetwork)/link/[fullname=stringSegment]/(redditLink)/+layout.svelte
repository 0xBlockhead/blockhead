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

	const detailHref = $derived(
		resolve(
			'/(social)/(reddit)/reddit/(globalRedditNetwork)/link/[fullname=stringSegment]',
			{
				fullname: params.fullname,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


{#key params.fullname}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			<RedditLinkView
				selection={
					select(EntityType.RedditLink, data.selector, {
						sources: [
							Source.Reddit_PublicJson,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
