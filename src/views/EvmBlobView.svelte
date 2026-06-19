<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		routeChildren,
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[blobIndex=nonNegativeInteger]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			transactionId: selection.entitySelector.txHash,
			blobIndex: selection.entitySelector.blobIndex.toString(),
		}),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			routeChildren?: Snippet
			selection: EntityProxyResource<typeof schema, EntityType.EvmBlob>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const blob = $derived(selection)
	const kzgCommitment = $derived(blob.kzgCommitment({
		sources: [Source.Blobscan_Rest],
	}))
	const blobDataStorageReferences = $derived(blob.blobDataStorageReferences({
		sources: [Source.Blobscan_Rest],
	}))
	const blobSelectorKey = $derived(
		stringify(selection.entitySelector),
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
	entitySelector={selection.entitySelector}
	href={href}
	title={`Blob sidecar #${String(selection.entitySelector.blobIndex)} (EIP-4844)`}
	idDragPlainText={stringify(selection.entitySelector)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span
			data-badge="small"
		>
			#{String(selection.entitySelector.blobIndex)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span data-badge="small">
				#{String(selection.entitySelector.blobIndex)}
			</span>

			<ResourceBoundary
				resource={kzgCommitment}
				placeholderText="Loading blob…"
			>
				{#snippet children(kzgCommitment)}
					{#if kzgCommitment !== undefined}
						<small>
							<TruncatedValue
								value={kzgCommitment}
								format={TruncatedValueFormat.Abbr}
							/>
						</small>
					{/if}
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
					<NumberValue value={selection.entitySelector.blobIndex} />
				</dd>
			</div>
			<div>
				<dt>KZG commitment</dt>
				<dd data-column="gap-1">
					<ResourceBoundary
						resource={kzgCommitment}
						placeholderText="Loading blob…"
					>
						{#snippet children(kzgCommitment)}
							{#if kzgCommitment !== undefined}
								<div data-row="wrap align-start gap-2">
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={kzgCommitment}
									/>

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
						resource={blobDataStorageReferences}
						placeholderText="Loading blob storage references…"
					>
						{#snippet children(blobDataStorageReferences)}
							{#if blobDataStorageReferences?.length}
								<ul>
									{#each blobDataStorageReferences as reference (
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
						<a href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]', {
								caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
								transactionId: selection.entitySelector.txHash,
							})}>
							<TruncatedValue
								value={selection.entitySelector.txHash}
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
			sectionIdPrefix={blobSelectorKey}
			sections={[
				{ id: 'blob-semantics', label: 'Blob primer' },
				{ id: 'page-content', label: 'Route' },
			]}
			id={`${blobSelectorKey}:carousel-blob`}
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
