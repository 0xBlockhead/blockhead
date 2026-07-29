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
	}: EntityListViewProps<EntityType.EnsReverseRecord_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EnsReverseRecord_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				verified: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: ensReverseRecordTimestamp })}
		{@const ensReverseRecordTimestampSelector = ensReverseRecordTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EnsReverseRecord_Timestamp}
			entitySelector={ensReverseRecordTimestampSelector}
		>
			{#snippet Title()}
				{ensReverseRecordTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{ensReverseRecordTimestamp.verified ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{ensReverseRecordTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
