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
		placeholderText,
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
			selection({
				sources: [
					Source.Voltaire_JsonRpc,
				],
				fields: {
					indexInTransaction: true,
					versionedHash: true,
					$transaction: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={evmBlobs.totalCount}
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
					{@const evmBlobFields = { ...evmBlob[EntityMetaKey.Selector], ...evmBlob }}
					{@const evmBlobHrefFields = { ...evmBlob, ...evmBlob[EntityMetaKey.Selector] }}
					<EvmBlobView
						selection={select(EntityType.EvmBlob, evmBlob[EntityMetaKey.Selector])}
						prefetched={evmBlobFields}
						href={
							(evmBlobHrefFields.$transaction !== undefined && evmBlobHrefFields.$transaction.$network !== undefined && evmBlobHrefFields.$transaction.$network.caip2 !== undefined && evmBlobHrefFields.$transaction.$network.caip2.namespace !== undefined && evmBlobHrefFields.$transaction !== undefined && evmBlobHrefFields.$transaction.$network !== undefined && evmBlobHrefFields.$transaction.$network.caip2 !== undefined && evmBlobHrefFields.$transaction.$network.caip2.reference !== undefined && evmBlobHrefFields.$transaction !== undefined && evmBlobHrefFields.$transaction.txHash !== undefined && evmBlobHrefFields.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(evmBlobHrefFields.$transaction.$network.caip2.namespace ?? '')}:${String(evmBlobHrefFields.$transaction.$network.caip2.reference ?? '')}`,
								transactionId: String(evmBlobHrefFields.$transaction.txHash ?? ''),
								indexInTransaction: String(evmBlobHrefFields.indexInTransaction ?? ''),
							}) : undefined)
						}
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
