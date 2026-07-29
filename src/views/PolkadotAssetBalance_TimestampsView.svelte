<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Asset balance observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAssetBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAssetBalance_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$asset: true,
				freeBalancePlancks: true,
				status: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotAssetBalanceTimestamp })}
		{@const polkadotAssetBalanceTimestampSelector = polkadotAssetBalanceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotAssetBalance_Timestamp}
			entitySelector={polkadotAssetBalanceTimestampSelector}
		>
			{#snippet Title()}
				{polkadotAssetBalanceTimestampSelector.$asset.assetId || 'Polkadot asset'}
			{/snippet}

			{#snippet Value()}
				{polkadotAssetBalanceTimestamp.freeBalancePlancks ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAssetBalanceTimestamp.status ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
