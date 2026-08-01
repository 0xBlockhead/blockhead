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
	}: EntityListViewProps<EntityType.FilecoinDeal> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.FilecoinDeal}
	bind:open
	resource={
		selection({
			fields: {
				dealId: true,
				$provider: true,
				$client: true,
				verifiedDeal: true,
			},
		})
	}
>
	{#snippet Item({ item: filecoinDeal })}
		{@const filecoinDealSelector = filecoinDeal[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.FilecoinDeal}
			entitySelector={filecoinDealSelector}
		>
			{#snippet Title()}
				{filecoinDealSelector.dealId}
			{/snippet}

			{#snippet Value()}
				{[filecoinDeal.$provider == null ? '' : filecoinDeal.$provider.minerAddress || 'filecoin miner', filecoinDeal.$client == null ? '' : filecoinDeal.$client.address || 'filecoin actor'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{filecoinDeal.verifiedDeal ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
