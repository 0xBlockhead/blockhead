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
	}: EntityListViewProps<EntityType.SolanaValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaValidator_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				delinquent: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaValidatorTimestamp })}
		{@const solanaValidatorTimestampSelector = solanaValidatorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SolanaValidator_Timestamp}
			entitySelector={solanaValidatorTimestampSelector}
		>
			{#snippet Title()}
				{String(solanaValidatorTimestampSelector.slot) || 'solana validator timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(solanaValidatorTimestamp.delinquent ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(solanaValidatorTimestamp.timestampMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
