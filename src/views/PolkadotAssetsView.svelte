<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Assets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotAsset}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				assetId: true,
				assetKind: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotAsset })}
		{@const polkadotAssetSelector = polkadotAsset[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotAsset}
			entitySelector={polkadotAssetSelector}
		>
			{#snippet Title()}
				{polkadotAssetSelector.assetId || 'Polkadot asset'}
			{/snippet}

			{#snippet Value()}
				{polkadotAssetSelector.assetKind}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotAsset.$network.name || (polkadotAssetSelector.$network.caip2 == null ? '' : `${polkadotAssetSelector.$network.caip2.namespace}:${polkadotAssetSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
