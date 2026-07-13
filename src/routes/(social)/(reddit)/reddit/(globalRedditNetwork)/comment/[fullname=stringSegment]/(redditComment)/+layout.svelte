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
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


{#key params.fullname}
	<ParentPageCollapsible
		href={
			resolve('/reddit/comment/[fullname=stringSegment]', {
				fullname: params.fullname,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = RedditCommentView}

			<DetailView
				selection={select(EntityType.RedditComment, data.selector)}
				href={
					resolve('/reddit/comment/[fullname=stringSegment]', {
						fullname: params.fullname,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
