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
	}: EntityListViewProps<EntityType.AvailAppId_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvailAppId_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				dataSubmissionCount: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: availAppIdTimestamp })}
		{@const availAppIdTimestampSelector = availAppIdTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvailAppId_Timestamp}
			entitySelector={availAppIdTimestampSelector}
		>
			{#snippet Title()}
				{availAppIdTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{availAppIdTimestamp.dataSubmissionCount ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{availAppIdTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
