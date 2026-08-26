<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.A2aAgentService, data.selector, {
		sources: [],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import A2aAgentServiceView from '$/views/A2aAgentServiceView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<A2aAgentServiceView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
