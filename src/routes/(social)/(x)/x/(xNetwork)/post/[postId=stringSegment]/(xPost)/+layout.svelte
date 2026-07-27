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
	import XPostView from '$/views/XPostView.svelte'
</script>


{#key params.postId}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
				{
					postId: String(params.postId),
				}
			)
		}
	>
		{#snippet Summary()}
			<XPostView
				selection={
					select(EntityType.XPost, data.selector, { sources: [
						Source.X_Rest,
						Source.X_FxEmbed_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
						{
							postId: String(params.postId),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
