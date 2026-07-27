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
	}: EntityListViewProps<EntityType.SolanaTokenMint_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTokenMint_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				supply: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaTokenMintTimestamp })}
		{@const solanaTokenMintTimestampSelector = solanaTokenMintTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SolanaTokenMint_Timestamp}
			entitySelector={solanaTokenMintTimestampSelector}
		>
			{#snippet Title()}
				{String(solanaTokenMintTimestampSelector.slot) || 'solana token mint timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(solanaTokenMintTimestamp.supply ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(solanaTokenMintTimestamp.timestampMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
