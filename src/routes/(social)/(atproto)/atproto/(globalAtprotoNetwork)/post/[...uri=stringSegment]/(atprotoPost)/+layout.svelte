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
	import AtprotoPostView from '$/views/AtprotoPostView.svelte'
</script>


{#key params.uri}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
				{
					uri: params.uri,
				}
			)
		}
	>
		{#snippet Summary()}
			<AtprotoPostView
				selection={
					select(EntityType.AtprotoPost, data.selector, { sources: [
						Source.Atproto_Xrpc,
					] })
				}
				href={
					resolve(
						'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
						{
							uri: params.uri,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
