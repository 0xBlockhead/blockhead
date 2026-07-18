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
	import LensPostView from '$/views/LensPostView.svelte'
</script>


{#key params.postId}
	<ParentPageCollapsible
		href={
			resolve('/lens/post/[postId=stringSegment]', {
				postId: params.postId,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = LensPostView}

			<DetailView
				selection={select(EntityType.LensPost, data.selector, { sources: [
		Source.Lens_Graphql,
	] })}
				href={
					resolve('/lens/post/[postId=stringSegment]', {
						postId: params.postId,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
