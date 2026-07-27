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
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.UtxoBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoBlock}
	bind:open
	resource={
		selection({
			fields: {
				height: true,
				hash: true,
				transactionCount: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoBlock })}
		{@const utxoBlockSelector = utxoBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UtxoBlock}
			entitySelector={utxoBlockSelector}
			href={
				(
					'hash' in utxoBlockSelector ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
							{
								network: (
									'caip2' in utxoBlockSelector.$network ?
										String(caip2StringFromValue(utxoBlockSelector.$network.caip2))
									:
										String(utxoBlockSelector.$network.slug)
								),
								blockNumber: String(utxoBlockSelector.height),
								hash: String(utxoBlockSelector.hash),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{(String(utxoBlockSelector.height ?? '') ? 'Block #' + String(utxoBlockSelector.height ?? '') : '') || (utxoBlockSelector.hash ?? '') || 'UTXO block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(utxoBlock.transactionCount ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
