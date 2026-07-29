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
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


{#key [params.network, params.projectId].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]',
				{
					network: params.network,
					projectId: params.projectId,
				}
			)
		}
	>
		{#snippet Summary()}
			<EvmRollupView
				selection={select(EntityType.EvmRollup, data.selector)}
				href={
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/rollup/[projectId=stringSegment]',
						{
							network: params.network,
							projectId: params.projectId,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
