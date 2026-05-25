<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { ChainId } from '$/constants/ChainId.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		routeChildren,
		entityId,
		href = resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(blobs)/blob/[transactionId]/[blobIndex]',
		{
			networkId: String(entityId.$network.chainId),
			transactionId: entityId.txHash,
			blobIndex: String(entityId.blobIndex),
		},
	),
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const blob = useEntity(
		EntityType.EvmBlob,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
			blobscanBlobJson: {
				$: [
					Source.Blobscan_Rest,
				],
			},
			versionedHash: {},
		},
	)


	// (Derived)
	const blobIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
			<span>Blob </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Heading()}

		<span data-row="inline align-center gap-2 wrap">
			<span
				data-badge="small"
			>
				#{String(entityId.blobIndex)}
			</span>
			<ResourceBoundary
				resource={blob}
				placeholderText="Loading blob…"
			>
				{#snippet children(loadedBlob)}
					<small>
						<TruncatedValue
							value={loadedBlob.versionedHash}
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
				<dt>Versioned hash (EIP‑4844)</dt>
				<dd>
					<ResourceBoundary
						resource={blob}
						placeholderText="Loading blob…"
					>
						{#snippet children(loadedBlob)}
							{#if loadedBlob.versionedHash !== undefined}
								<TruncatedValue
									value={loadedBlob.versionedHash}
									format={TruncatedValueFormat.Abbr}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			{#if entityId.$network.chainId === ChainId.Ethereum}
				<div>
					<dt>Blobscan</dt>
					<dd>
						<ResourceBoundary
							resource={blob}
							placeholderText="Loading blob…"
						>
							{#snippet children(loadedBlob)}
								{#if loadedBlob.versionedHash !== undefined}
									<a
										href={`https://blobscan.com/blob/${loadedBlob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{:else if entityId.$network.chainId === ChainId.EthereumSepolia}
				<div>
					<dt>Blobscan</dt>
					<dd>
						<ResourceBoundary
							resource={blob}
							placeholderText="Loading blob…"
						>
							{#snippet children(loadedBlob)}
								{#if loadedBlob.versionedHash !== undefined}
									<a
										href={`https://sepolia.blobscan.com/blob/${loadedBlob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{:else if entityId.$network.chainId === ChainId.Gnosis}
				<div>
					<dt>Blobscan</dt>
					<dd>
						<ResourceBoundary
							resource={blob}
							placeholderText="Loading blob…"
						>
							{#snippet children(loadedBlob)}
								{#if loadedBlob.versionedHash !== undefined}
									<a
										href={`https://gnosis.blobscan.com/blob/${loadedBlob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{:else if entityId.$network.chainId === 560048}
				<div>
					<dt>Blobscan</dt>
					<dd>
						<ResourceBoundary
							resource={blob}
							placeholderText="Loading blob…"
						>
							{#snippet children(loadedBlob)}
								{#if loadedBlob.versionedHash !== undefined}
									<a
										href={`https://hoodi.blobscan.com/blob/${loadedBlob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Blobscan indexer payload</dt>
				<dd data-column="gap-1">
					<ResourceBoundary
						resource={blob}
						placeholderText="Loading blob…"
					>
						{#snippet children(loadedBlob)}
							{#if loadedBlob.blobscanBlobJson !== undefined}
								<div data-row="wrap align-start gap-2">
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={loadedBlob.blobscanBlobJson}
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
											<p><code>{'GET /blobs/{versionedHash}'}</code> JSON from the Blobscan REST API (commitment, proof, sizes, storage references). Only on chains their indexer hosts.</p>
										{/snippet}
									{/if}
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Type‑3 transaction hash</dt>
					<dd>
						<a
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(transactions)/tx/[transactionId]',
								{
								networkId: String(entityId.$network.chainId),
								transactionId: entityId.txHash,
								},
							)}
						>
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
		open: _detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.EvmBlob}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			{#if true}
				<CollapsibleTabs
					id={`${blobIdKey}:carousel-blob`}
					Summary={BlobCarouselSummary}
					Markers={BlobCarouselMarkers}
					body={BlobCarouselBody}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				/>
				{#snippet BlobCarouselSummary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<SectionHeading>Type‑3 execution payload</SectionHeading>
					</header>
				{/snippet}

				{#snippet BlobCarouselMarkers({
					open: _blobCarouselMarkersOpen,
				})}
					<a
						data-scroll-marker-label="Blob primer"
						href={`#${blobIdKey}:blob-semantics`}
					>Consensus + execution roles</a>
					{#if routeChildren}
						<a
							data-scroll-marker-label="Route"
							href={`#${blobIdKey}:page-content`}
						>Route</a>
					{/if}
				{/snippet}

				{#snippet BlobCarouselBody({ open: _tabOpen })}
					<section
						id={`${blobIdKey}:blob-semantics`}
					>
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
					</section>

					{#if routeChildren}
						<section
							id={`${blobIdKey}:page-content`}
						>
							{@render routeChildren()}
						</section>
					{/if}
				{/snippet}
			{/if}
		</div>
	{/snippet}
</EntityView>
