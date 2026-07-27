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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.GitRefObservation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.GitRefObservation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				source: true,
				targetObjectId: true,
			},
		})
	}
>
	{#snippet Item({ item: gitRefObservationTimestamp })}
		{@const gitRefObservationTimestampSelector = gitRefObservationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.GitRefObservation_Timestamp}
			entitySelector={gitRefObservationTimestampSelector}
		>
			{#snippet Title()}
				{String(gitRefObservationTimestampSelector.timestampMs) || 'Git ref observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{gitRefObservationTimestampSelector.source}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(gitRefObservationTimestamp.targetObjectId ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
