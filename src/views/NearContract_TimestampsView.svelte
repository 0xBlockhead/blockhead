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
	}: EntityListViewProps<EntityType.NearContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NearContract_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				codeHash: true,
				blockHeight: true,
			},
		})
	}
>
	{#snippet Item({ item: nearContractTimestamp })}
		{@const nearContractTimestampSelector = nearContractTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.NearContract_Timestamp}
			entitySelector={nearContractTimestampSelector}
		>
			{#snippet Title()}
				{String(nearContractTimestampSelector.timestampMs) || 'near contract timestamp'}
			{/snippet}

			{#snippet Value()}
				{(nearContractTimestamp.codeHash ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(nearContractTimestamp.blockHeight ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
