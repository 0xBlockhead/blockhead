<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


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


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			{#key data.selector}
				<RedditLinkView
					selection={
						untrack(() => select(EntityType.RedditLink, data.selector, {
							sources: [
								Source.Reddit_PublicJson,
								Source.Reddit_Rest,
							],
						}))
					}
					href={detailHref}
					layout={EntityLayout.SummaryInline}
				/>
			{/key}
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
