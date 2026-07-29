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
	import EnsRecordView from '$/views/EnsRecordView.svelte'
</script>


{#key [params.ensName, params.recordId].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
				{
					ensName: params.ensName,
					recordId: params.recordId,
				}
			)
		}
	>
		{#snippet Summary()}
			<EnsRecordView
				selection={
					select(EntityType.EnsRecord, data.selector, { sources: [
						Source.TheGraph_Graphql,
						Source.Voltaire_JsonRpc,
					] })
				}
				href={
					resolve(
						'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/record/[recordId=stringSegment]',
						{
							ensName: params.ensName,
							recordId: params.recordId,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
