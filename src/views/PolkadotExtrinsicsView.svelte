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
		title = 'Extrinsics',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PolkadotExtrinsic> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotExtrinsic}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInBlock: true,
				callName: true,
				success: true,
			},
		})
	}
>
	{#snippet Item({ item: polkadotExtrinsic })}
		{@const polkadotExtrinsicSelector = polkadotExtrinsic[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.PolkadotExtrinsic}
			entitySelector={polkadotExtrinsicSelector}
			href={
				(
					'hash' in polkadotExtrinsicSelector.$block ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]/(selection)/extrinsic/[extrinsicIndex=nonNegativeInteger]',
							{
								network: (
									'caip2' in polkadotExtrinsicSelector.$block.$network ?
										String(caip2StringFromValue(polkadotExtrinsicSelector.$block.$network.caip2))
									:
										String(polkadotExtrinsicSelector.$block.$network.slug)
								),
								blockNumber: String(polkadotExtrinsicSelector.$block.blockNumber),
								hash: String(polkadotExtrinsicSelector.$block.hash),
								extrinsicIndex: String(polkadotExtrinsicSelector.indexInBlock),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{(String(polkadotExtrinsicSelector.indexInBlock ?? '') ? 'Extrinsic #' + String(polkadotExtrinsicSelector.indexInBlock ?? '') : '') || 'Polkadot extrinsic'}
			{/snippet}

			{#snippet Value()}
				{(polkadotExtrinsic.callName ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(polkadotExtrinsic.success ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
