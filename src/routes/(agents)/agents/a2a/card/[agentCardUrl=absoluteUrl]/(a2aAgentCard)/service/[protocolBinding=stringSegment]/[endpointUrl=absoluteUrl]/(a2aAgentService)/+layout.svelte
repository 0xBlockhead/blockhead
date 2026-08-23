<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(agents)/agents/a2a/card/[agentCardUrl=absoluteUrl]/(a2aAgentCard)/service/[protocolBinding=stringSegment]/[endpointUrl=absoluteUrl]',
			{
				agentCardUrl: params.agentCardUrl,
				protocolBinding: params.protocolBinding,
				endpointUrl: params.endpointUrl,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if data?.selector != null}
			<A2aAgentServiceView
				selection={
					select(EntityType.A2aAgentService, data.selector, {
						sources: [],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
