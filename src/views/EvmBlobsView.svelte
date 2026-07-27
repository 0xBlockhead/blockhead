<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmBlob> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Blob sidecars hold the opaque data payloads referenced by EIP-4844 blob transactions.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmBlob}
	bind:open
	TypeAnnotationTooltip={ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Voltaire_JsonRpc,
			],
			fields: {
				indexInTransaction: true,
				versionedHash: true,
			},
		})
	}
>
	{#snippet Item({ item: evmBlob })}
		{@const evmBlobSelector = evmBlob[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmBlob}
			entitySelector={evmBlobSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]',
					{
						network: (
							'caip2' in evmBlobSelector.$transaction.$network ?
								String(caip2StringFromValue(evmBlobSelector.$transaction.$network.caip2))
							:
								String(evmBlobSelector.$transaction.$network.slug)
						),
						transactionId: String(evmBlobSelector.$transaction.txHash),
						indexInTransaction: String(evmBlobSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(evmBlobSelector.indexInTransaction ?? '') ? 'Blob #' + String(evmBlobSelector.indexInTransaction ?? '') : '') || 'EVM blob'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(evmBlob.versionedHash)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
