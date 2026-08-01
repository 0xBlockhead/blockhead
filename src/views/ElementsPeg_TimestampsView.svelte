<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.ElementsPeg_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsPeg_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				confirmations: true,
			},
		})
	}
>
	{#snippet Item({ item: elementsPegTimestamp })}
		{@const elementsPegTimestampSelector = elementsPegTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.ElementsPeg_Timestamp}
			entitySelector={elementsPegTimestampSelector}
		>
			{#snippet Title()}
				{elementsPegTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{elementsPegTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{elementsPegTimestamp.confirmations ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
