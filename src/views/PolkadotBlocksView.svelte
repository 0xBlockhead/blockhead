<!-- Generated from APP.ts. -->

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
		title = 'Blocks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotBlock}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				hash: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotBlock })}
		{@const polkadotBlockSelector = polkadotBlock[EntityMetaKey.Selector]}
		{@const network = polkadotBlockSelector.$network}
		<EntityView
			entityType={EntityType.PolkadotBlock}
			entitySelector={polkadotBlockSelector}
			href={
				polkadotBlockSelector.hash !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(polkadotBlockSelector.blockNumber),
							hash: polkadotBlockSelector.hash,
						}
					)
				:
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(polkadotBlockSelector.blockNumber),
						}
					)
			}
		>
			{#snippet Title()}
				{`Block #${polkadotBlockSelector.blockNumber}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotBlock.hash}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
