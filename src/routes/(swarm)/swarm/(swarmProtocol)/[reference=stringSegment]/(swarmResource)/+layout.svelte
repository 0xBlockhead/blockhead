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
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


{#key params.reference}
	<ParentPageCollapsible
		href={
			resolve(
				'/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
				{
					reference: String(params.reference),
				}
			)
		}
	>
		{#snippet Summary()}
			<SwarmResourceView
				selection={
					select(EntityType.SwarmResource, data.selector, { sources: [
						Source.Swarm_Rest,
					] })
				}
				href={
					resolve(
						'/(swarm)/swarm/(swarmProtocol)/[reference=stringSegment]',
						{
							reference: String(params.reference),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
