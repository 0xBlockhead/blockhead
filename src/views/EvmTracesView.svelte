<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmInternalCallType } from '$/constants/Evm.ts'


	// State
	let {
		selection,
		title = 'Traces',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmTrace> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTrace}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				index: true,
				traceAddress: true,
				type: true,
				error: true,
			},
		})
	}
>
	{#snippet Item({ item: evmTrace })}
		{@const evmTraceSelector = evmTrace[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmTrace}
			entitySelector={evmTraceSelector}
		>
			{#snippet Title()}
				{(String(evmTrace.index ?? '') ? 'Trace #' + String(evmTrace.index ?? '') : '') || (evmTraceSelector.traceAddress ?? '') || 'EVM trace'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[evmTrace.type, (evmTrace.error ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
