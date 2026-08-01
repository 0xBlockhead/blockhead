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
			'/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topic/[hex=evmTopicHash]',
			{
				hex: params.hex,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


{#key params.hex}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			<EvmTopicView
				selection={
					select(EntityType.EvmTopic, data.selector, {
						sources: [
							Source.Openchain_Rest,
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
