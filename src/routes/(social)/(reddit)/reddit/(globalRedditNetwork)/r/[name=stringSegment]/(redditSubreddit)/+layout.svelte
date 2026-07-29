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
	import RedditSubredditView from '$/views/RedditSubredditView.svelte'
</script>


{#key params.name}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
				{
					name: params.name,
				}
			)
		}
	>
		{#snippet Summary()}
			<RedditSubredditView
				selection={
					select(EntityType.RedditSubreddit, data.selector, { sources: [
						Source.Reddit_PublicJson,
					] })
				}
				href={
					resolve(
						'/(social)/(reddit)/reddit/(globalRedditNetwork)/r/[name=stringSegment]',
						{
							name: params.name,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
