<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.TonTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonTrace}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonTrace })}
		{@const tonTraceSelector = tonTrace[EntityMetaKey.Selector]}
		{@const network = tonTraceSelector.$network}
		{@const rootMessage = tonTraceSelector.$rootMessage}
		<EntityView
			entityType={EntityType.TonTrace}
			entitySelector={tonTraceSelector}
			href={
				'$rootMessage' in tonTraceSelector
				&& 'messageHash' in rootMessage
				&& '$network' in rootMessage ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/ton/[messageHash=stringSegment]/(tonMessage)/trace/[source=stringSegment]',
						{
							network: (
								'caip2' in rootMessage.$network ?
									caip2StringFromValue(rootMessage.$network.caip2)
								:
									rootMessage.$network.slug
							),
							messageHash: rootMessage.messageHash,
							source: tonTraceSelector.source,
						}
					)
				:
					'traceId' in tonTraceSelector
					&& '$network' in tonTraceSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trace/[traceId=stringSegment]/[traceSource=stringSegment]',
							{
								network: (
									'caip2' in network ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								traceId: tonTraceSelector.traceId,
								traceSource: tonTraceSelector.source,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				TON trace
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
