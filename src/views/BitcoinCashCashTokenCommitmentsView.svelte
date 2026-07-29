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
	}: EntityListViewProps<EntityType.BitcoinCashCashTokenCommitment> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	bind:open
	resource={
		selection({
			fields: {
				commitmentHex: true,
				$output: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinCashCashTokenCommitment })}
		{@const bitcoinCashCashTokenCommitmentSelector = bitcoinCashCashTokenCommitment[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BitcoinCashCashTokenCommitment}
			entitySelector={bitcoinCashCashTokenCommitmentSelector}
		>
			{#snippet Title()}
				{bitcoinCashCashTokenCommitment.commitmentHex || 'Bitcoin Cash CashToken commitment'}
			{/snippet}

			{#snippet Value()}
				{bitcoinCashCashTokenCommitment.commitmentHex}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{`Output #${bitcoinCashCashTokenCommitmentSelector.$output.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
