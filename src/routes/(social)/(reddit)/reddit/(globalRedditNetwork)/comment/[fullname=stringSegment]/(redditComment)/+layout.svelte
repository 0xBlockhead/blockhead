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
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


{#key params.fullname}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
				{
					fullname: params.fullname,
				}
			)
		}
	>
		{#snippet Summary()}
			<RedditCommentView
				selection={
					select(EntityType.RedditComment, data.selector, { sources: [
						Source.Reddit_PublicJson,
					] })
				}
				href={
					resolve(
						'/(social)/(reddit)/reddit/(globalRedditNetwork)/comment/[fullname=stringSegment]',
						{
							fullname: params.fullname,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
