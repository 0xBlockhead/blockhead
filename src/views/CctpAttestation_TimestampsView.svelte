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
	}: EntityListViewProps<EntityType.CctpAttestation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CctpAttestation_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: cctpAttestationTimestamp })}
		{@const cctpAttestationTimestampSelector = cctpAttestationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CctpAttestation_Timestamp}
			entitySelector={cctpAttestationTimestampSelector}
		>
			{#snippet Title()}
				{cctpAttestationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{cctpAttestationTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cctpAttestationTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
