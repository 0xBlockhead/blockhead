<!-- Generated from APP.ts. -->

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
			'/~/session/[sessionId=stringSegment]/(blockheadSession)/action/[actionId=stringSegment]/(blockheadSessionAction)/readiness-check/[checkId=stringSegment]',
			{
				sessionId: params.sessionId,
				actionId: params.actionId,
				checkId: params.checkId,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadActionReadinessCheckView from '$/views/BlockheadActionReadinessCheckView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BlockheadActionReadinessCheckView
			selection={
				select(EntityType.BlockheadActionReadinessCheck, data.selector, {
					sources: [
						Source.Local_Internal,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
