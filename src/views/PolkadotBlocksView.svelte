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
		<EntityView
			entityType={EntityType.PolkadotBlock}
			entitySelector={polkadotBlockSelector}
			href={
				(
					'hash' in polkadotBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
							{
								network: (
									'caip2' in polkadotBlockSelector.$network ?
										String(caip2StringFromValue(polkadotBlockSelector.$network.caip2))
									:
										String(polkadotBlockSelector.$network.slug)
								),
								blockNumber: String(polkadotBlockSelector.blockNumber),
								hash: String(polkadotBlockSelector.hash),
							}
						)
					:
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in polkadotBlockSelector.$network ?
										String(caip2StringFromValue(polkadotBlockSelector.$network.caip2))
									:
										String(polkadotBlockSelector.$network.slug)
								),
								blockNumber: String(polkadotBlockSelector.blockNumber),
							}
						)
				)
			}
		>
			{#snippet Title()}
				{(String(polkadotBlockSelector.blockNumber ?? '') ? 'Block #' + String(polkadotBlockSelector.blockNumber ?? '') : '') || (polkadotBlockSelector.hash ?? '') || 'Polkadot block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{polkadotBlockSelector.hash}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
