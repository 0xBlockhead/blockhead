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
	}: EntityListViewProps<EntityType.CashuKeyset_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CashuKeyset_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				active: true,
				inputFeePpk: true,
			},
		})
	}
>
	{#snippet Item({ item: cashuKeysetTimestamp })}
		{@const cashuKeysetTimestampSelector = cashuKeysetTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.CashuKeyset_Timestamp}
			entitySelector={cashuKeysetTimestampSelector}
		>
			{#snippet Title()}
				{String(cashuKeysetTimestampSelector.timestampMs) || 'Cashu keyset timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String(cashuKeysetTimestamp.active ?? ''), String(cashuKeysetTimestamp.inputFeePpk ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
