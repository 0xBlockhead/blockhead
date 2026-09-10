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
	}: EntityListViewProps<EntityType.IbcDenomTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IbcDenomTrace}
	bind:open
	resource={
		selection({
			fields: {
				displayDenom: true,
				baseDenom: true,
				traceKey: true,
				denomHash: true,
				sourceChannel: true,
			},
		})
	}
>
	{#snippet Item({ item: ibcDenomTrace })}
		{@const ibcDenomTraceSelector = ibcDenomTrace[EntityMetaKey.Selector]}
		{@const network = ibcDenomTraceSelector.$network}
		<EntityView
			entityType={EntityType.IbcDenomTrace}
			entitySelector={ibcDenomTraceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/ibc/denom-trace/[traceKey=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						traceKey: ibcDenomTraceSelector.traceKey,
					}
				)
			}
		>
			{#snippet Title()}
				{[(ibcDenomTrace.displayDenom ?? ''), (ibcDenomTrace.baseDenom ?? ''), ibcDenomTraceSelector.traceKey].filter(Boolean).join(' ') || 'IBC denom trace'}
			{/snippet}

			{#snippet Value()}
				{[(ibcDenomTrace.denomHash ?? ''), ibcDenomTraceSelector.traceKey].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ibcDenomTrace.sourceChannel ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
