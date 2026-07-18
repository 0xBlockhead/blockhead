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
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


{#key params.ensName}
	<ParentPageCollapsible
		href={
			resolve('/ens/name/[ensName=stringSegment]', {
				ensName: params.ensName,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = EnsNameView}

			<DetailView
				selection={select(EntityType.EnsName, data.selector, { sources: [
		Source.TheGraph_Graphql,
		Source.Voltaire_JsonRpc,
	] })}
				href={
					resolve('/ens/name/[ensName=stringSegment]', {
						ensName: params.ensName,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
