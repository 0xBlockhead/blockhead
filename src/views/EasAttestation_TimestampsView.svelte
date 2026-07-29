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
	}: EntityListViewProps<EntityType.EasAttestation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EasAttestation_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				valid: true,
				revoked: true,
			},
		})
	}
>
	{#snippet Item({ item: easAttestationTimestamp })}
		{@const easAttestationTimestampSelector = easAttestationTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EasAttestation_Timestamp}
			entitySelector={easAttestationTimestampSelector}
		>
			{#snippet Title()}
				{easAttestationTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{easAttestationTimestamp.valid ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{easAttestationTimestamp.revoked ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
