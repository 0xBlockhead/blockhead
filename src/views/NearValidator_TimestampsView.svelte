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
	}: EntityListViewProps<EntityType.NearValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearValidator_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				epochId: true,
				validatorSetRole: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: nearValidatorTimestamp })}
		{@const nearValidatorTimestampSelector = nearValidatorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearValidator_Timestamp}
			entitySelector={nearValidatorTimestampSelector}
		>
			{#snippet Title()}
				{nearValidatorTimestampSelector.epochId || 'near validator timestamp'}
			{/snippet}

			{#snippet Value()}
				{nearValidatorTimestamp.validatorSetRole ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{nearValidatorTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
