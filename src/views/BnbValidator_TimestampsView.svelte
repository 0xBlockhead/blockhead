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
	}: EntityListViewProps<EntityType.BnbValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BnbValidator_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					jailed: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bnbValidatorTimestamp })}
		{@const bnbValidatorTimestampSelector = bnbValidatorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BnbValidator_Timestamp}
			entitySelector={bnbValidatorTimestampSelector}
		>
			{#snippet Title()}
				{bnbValidatorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(bnbValidatorTimestamp.status ?? ''), String(bnbValidatorTimestamp.jailed ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bnbValidatorTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
