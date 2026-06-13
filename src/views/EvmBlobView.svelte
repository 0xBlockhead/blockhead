<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		routeChildren,
		entityId,
			href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(blobs)/blob/[transactionId]/[blobIndex]', {
			...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
			transactionId: entityId.txHash,
				blobIndex: entityId.blobIndex.toString(),
			}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			routeChildren?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmBlob>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const blob = subscribe(EntityType.EvmBlob,
		entityId,
		({ sources: [
				Source.Voltaire_JsonRpc,
			], fields: { kzgCommitment: ({ sources: [
					Source.Blobscan_Rest,
				] }), blobDataStorageReferences: ({ sources: [
					Source.Blobscan_Rest,
				] }), versionedHash: true } }),
	)


	// (Derived)
	const blobIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import SectionHeading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	{entityId}
	href={href}
	title={`Blob sidecar #${String(entityId.blobIndex)} (EIP-4844)`}
	idDragPlainText={stringify(entityId)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
		>
			#{String(entityId.blobIndex)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
				<span data-badge="small">
			#{String(entityId.blobIndex)}
		</span>

			<ResourceBoundary
				resource={blob}
				placeholderText="Loading blob…"
			>
				{#snippet children(blob)}
					<small>
						<TruncatedValue
							value={blob.fields.versionedHash}
							format={TruncatedValueFormat.Abbr}
						/>
					</small>
				{/snippet}
			</ResourceBoundary>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Blob-bearing transactions anchor large binary payloads beside the usual execution payload: commitments and blob gas live in header metadata while the opaque bytes ride in sidecars.
		</p>
		<p>
			The <strong>versioned hash</strong> is the blob’s committed identifier in EIP‑4844 (derived from the KZG commitment)—not contract bytecode nor log fingerprints.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<div>
				<dt>Blob index</dt>
				<dd>
					<NumberValue value={entityId.blobIndex} />
				</dd>
			</div>
			<div>
				<dt>Versioned hash</dt>
				<dd>
					<ResourceBoundary
						resource={blob}
						placeholderText="Loading blob…"
					>
						{#snippet children(blob)}
							{#if blob.fields.versionedHash !== undefined}
								<TruncatedValue
									value={blob.fields.versionedHash}
									format={TruncatedValueFormat.Abbr}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>KZG commitment</dt>
				<dd data-column="gap-1">
					<ResourceBoundary
						resource={blob}
						placeholderText="Loading blob…"
					>
						{#snippet children(blob)}
							{#if blob.fields.kzgCommitment !== undefined}
								<div data-row="wrap align-start gap-2">
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={blob.fields.kzgCommitment}
									/>
									{#if true}
										<Tooltip
											contentProps={{ side: 'top' }}
											Content={BlobscanIndexerPayloadTooltip}
										>
											<abbr
												class="entity-heading-tip"
												aria-label="Blobscan indexer payload"
											>ⓘ</abbr>
										</Tooltip>

										{#snippet BlobscanIndexerPayloadTooltip()}
											<p><code>GET /blobs/:versionedHash</code> data from the Blobscan REST API. Only on chains their indexer hosts.</p>
										{/snippet}
									{/if}
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Blob storage</dt>
				<dd>
					<ResourceBoundary
						resource={blob}
						placeholderText="Loading blob storage references…"
					>
						{#snippet children(blob)}
							{#if blob.fields.blobDataStorageReferences?.length}
								<ul>
									{#each blob.fields.blobDataStorageReferences as reference (
										`${reference.storage}:${reference.reference}`
							)}
										<li>
											<span>{reference.storage}</span>
											<TruncatedValue
												value={reference.reference}
										format={TruncatedValueFormat.Visual}
											/>
										</li>
									{/each}
								</ul>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Transaction</dt>
					<dd>
							<a href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(transactions)/tx/[transactionId]', {
								...{ caip2Namespace: entityId.$network.caip2.namespace, caip2Reference: entityId.$network.caip2.reference },
								transactionId: entityId.txHash,
							})}>
							<TruncatedValue
								value={entityId.txHash}
								format={TruncatedValueFormat.Abbr}
							/>
						</a>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open,
	})}
		<CollapsibleTabs
			sectionIdPrefix={blobIdKey}
			sections={[
				{ id: 'blob-semantics', label: 'Blob primer' },
					{ id: 'page-content', label: 'Route' },
			]}
			id={`${blobIdKey}:carousel-blob`}
			data-card
		>
			{#snippet Summary({ open: _isOpen })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<SectionHeading>Type‑3 execution payload</SectionHeading>
				</header>
			{/snippet}

			{#snippet SectionBlobSemantics({ id: _semanticsId, label: _semanticsLabel })}
				<div data-row="wrap align-center gap-2">
					<span data-text="annotation">Consensus + execution roles</span>
					{#if true}
						<Tooltip
							contentProps={{ side: 'top' }}
							Content={BlobSemanticsTooltip}
						>
							<abbr
								class="entity-heading-tip"
								aria-label="Blob semantics"
							>ⓘ</abbr>
						</Tooltip>

						{#snippet BlobSemanticsTooltip()}
							<p>Blobs extend execution payloads with large binaries whose integrity is proved via KZG commitments — versioned hashes bind each sidecar to a succinct witness apart from execution gas; EIP‑4844 blob gas and pruning follow their own schedule while rollups may persist data off-chain.</p>
						{/snippet}
					{/if}
				</div>
			{/snippet}

			{#snippet SectionPageContent({ id: _contentId, label: _contentLabel })}
				{#if routeChildren}
					{@render routeChildren()}
				{/if}
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
