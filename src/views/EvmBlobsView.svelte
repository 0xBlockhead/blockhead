<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM blobs',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM blobs...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmBlobs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmBlob>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
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

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: [
					Source.Voltaire_JsonRpc,
					Source.Blobscan_Rest,
				],
				fields: {
					indexInTransaction: true,
					versionedHash: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmBlob}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(evmBlobs)}
			{@const uniqueEvmBlobs = [...new Map(evmBlobs.values.map((evmBlob) => [evmBlob[EntityMetaKey.SelectorKey], evmBlob])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmBlob}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmBlobs.values.length === uniqueEvmBlobs.length && evmBlobs.totalCount != null && evmBlobs.totalCount >= uniqueEvmBlobs.length ? evmBlobs.totalCount : uniqueEvmBlobs.length}
				getKey={(evmBlob) => evmBlob[EntityMetaKey.SelectorKey]}
				items={uniqueEvmBlobs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM blobs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmBlob }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmBlob> })}
					<EvmBlobView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(({ ...evmBlob.entitySelector, ...evmBlob }).$transaction.$network.caip2.namespace)}:${String(({ ...evmBlob.entitySelector, ...evmBlob }).$transaction.$network.caip2.reference)}`,
								transactionId: String(({ ...evmBlob.entitySelector, ...evmBlob }).$transaction.txHash),
								indexInTransaction: String(({ ...evmBlob.entitySelector, ...evmBlob }).indexInTransaction),
							})
						}
						selection={select(EntityType.EvmBlob, evmBlob.entitySelector)}
						prefetched={evmBlob}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmBlob}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
