<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM blobs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmBlobs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmBlob>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Blob sidecars hold the opaque data payloads referenced by EIP-4844 blob transactions.
	</p>
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmBlob}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Voltaire_JsonRpc,
			],
			fields: {
				indexInTransaction: true,
				versionedHash: true,
				$transaction: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmBlobs) => [...new Map(evmBlobs.values.map((evmBlob) => [evmBlob[EntityMetaKey.SelectorKey], evmBlob])).values()]}
	getKey={(evmBlob) => evmBlob[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM blobs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmBlob })}
		{@const evmBlobFields = { ...evmBlob[EntityMetaKey.Selector], ...evmBlob }}
		<EntityView
			entityType={EntityType.EvmBlob}
			entitySelector={evmBlob[EntityMetaKey.Selector]}
			href={
				(
					evmBlob[EntityMetaKey.Selector] != null && '$transaction' in evmBlob[EntityMetaKey.Selector]
					&& evmBlob[EntityMetaKey.Selector].$transaction != null && 'txHash' in evmBlob[EntityMetaKey.Selector].$transaction
					&& evmBlob[EntityMetaKey.Selector].$transaction.txHash != null
					&& evmBlob[EntityMetaKey.Selector] != null && 'indexInTransaction' in evmBlob[EntityMetaKey.Selector]
					&& evmBlob[EntityMetaKey.Selector].indexInTransaction != null
					&& evmBlob[EntityMetaKey.Selector].$transaction != null && '$network' in evmBlob[EntityMetaKey.Selector].$transaction ?
						evmBlob[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in evmBlob[EntityMetaKey.Selector].$transaction.$network
						&& evmBlob[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
						transactionId: String(evmBlob[EntityMetaKey.Selector].$transaction.txHash ?? ''),
						indexInTransaction: String(evmBlob[EntityMetaKey.Selector].indexInTransaction ?? ''),
						network: String(caip2StringFromValue(evmBlob[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							evmBlob[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in evmBlob[EntityMetaKey.Selector].$transaction.$network
							&& evmBlob[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
							transactionId: String(evmBlob[EntityMetaKey.Selector].$transaction.txHash ?? ''),
							indexInTransaction: String(evmBlob[EntityMetaKey.Selector].indexInTransaction ?? ''),
							network: String(evmBlob[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((evmBlobFields.indexInTransaction) ?? '') ? 'Blob #' + String((evmBlobFields.indexInTransaction) ?? '') : '') || 'EVM blob'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmBlobFields.versionedHash) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
