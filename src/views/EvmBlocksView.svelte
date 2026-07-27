<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A block in an EVM-compatible execution chain.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmBlock}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				blockNumber: true,
				hash: true,
			},
		})
	}
>
	{#snippet Item({ item: evmBlock })}
		{@const evmBlockSelector = evmBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmBlock}
			entitySelector={evmBlockSelector}
			href={
				(
					'blockNumber' in evmBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
							{
								network: (
									'caip2' in evmBlockSelector.$network ?
										String(caip2StringFromValue(evmBlockSelector.$network.caip2))
									:
										String(evmBlockSelector.$network.slug)
								),
								blockNumber: String(evmBlockSelector.blockNumber),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{(String(evmBlockSelector.blockNumber ?? '') ? 'Block #' + String(evmBlockSelector.blockNumber ?? '') : '') || String(evmBlockSelector.hash ?? '') || 'EVM block'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
