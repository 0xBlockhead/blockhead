<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
		<EntityView
			entityType={EntityType.IbcDenomTrace}
			entitySelector={ibcDenomTraceSelector}
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
