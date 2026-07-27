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
	}: EntityListViewProps<EntityType.MoveModule_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoveModule_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				ledgerVersion: true,
				packageVersion: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: moveModuleTimestamp })}
		{@const moveModuleTimestampSelector = moveModuleTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.MoveModule_Timestamp}
			entitySelector={moveModuleTimestampSelector}
		>
			{#snippet Title()}
				{String(moveModuleTimestampSelector.timestampMs) || 'move module timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(moveModuleTimestamp.ledgerVersion ?? ''), String(moveModuleTimestamp.packageVersion ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moveModuleTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
