<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Pallets',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotPallet> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotPallet}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				palletName: true,
				index: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotPallet })}
		{@const polkadotPalletSelector = polkadotPallet[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotPallet}
			entitySelector={polkadotPalletSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/pallet/[palletName=stringSegment]',
					{
						network: (
							'caip2' in polkadotPalletSelector.$network ?
								String(caip2StringFromValue(polkadotPalletSelector.$network.caip2))
							:
								String(polkadotPalletSelector.$network.slug)
						),
						palletName: String(polkadotPalletSelector.palletName),
					}
				)
			}
		>
			{#snippet Title()}
				{polkadotPalletSelector.palletName || 'Polkadot pallet'}
			{/snippet}

			{#snippet Value()}
				{polkadotPalletSelector.palletName}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(polkadotPallet.index ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
