<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		title = 'Storage reads',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmStorageRead_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmStorageRead_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				value: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: evmStorageReadTimestamp })}
		{@const evmStorageReadTimestampSelector = evmStorageReadTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmStorageRead_Timestamp}
			entitySelector={evmStorageReadTimestampSelector}
		>
			{#snippet Title()}
				{String(evmStorageReadTimestampSelector.slot) || 'EVM storage read timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(evmStorageReadTimestamp.value ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmStorageReadTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
