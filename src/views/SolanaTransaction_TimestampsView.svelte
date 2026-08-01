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
	}: EntityListViewProps<EntityType.SolanaTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTransaction_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				status: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTransactionTimestamp })}
		{@const solanaTransactionTimestampSelector = solanaTransactionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SolanaTransaction_Timestamp}
			entitySelector={solanaTransactionTimestampSelector}
		>
			{#snippet Title()}
				{solanaTransactionTimestampSelector.slot}
			{/snippet}

			{#snippet Value()}
				{solanaTransactionTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTransactionTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
