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
	}: EntityListViewProps<EntityType.SolanaAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaAccount_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				slot: true,
				lamports: true,
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaAccountTimestamp })}
		{@const solanaAccountTimestampSelector = solanaAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.SolanaAccount_Timestamp}
			entitySelector={solanaAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(solanaAccountTimestampSelector.slot) || 'solana account timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(solanaAccountTimestamp.lamports ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(solanaAccountTimestamp.timestampMs ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
