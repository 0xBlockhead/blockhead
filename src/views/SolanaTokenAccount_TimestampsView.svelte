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
	}: EntityListViewProps<EntityType.SolanaTokenAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				amount: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTokenAccountTimestamp })}
		{@const solanaTokenAccountTimestampSelector = solanaTokenAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SolanaTokenAccount_Timestamp}
			entitySelector={solanaTokenAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(solanaTokenAccountTimestampSelector.slot) || 'solana token account timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(solanaTokenAccountTimestamp.amount ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(solanaTokenAccountTimestamp.timestampMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
