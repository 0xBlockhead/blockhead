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
		children: _children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmBlob>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()

	const blobIdKey = $derived(
		stringify(entityId),
	)


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


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Heading from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmBlob}
	{entityId}
	title={`Blob sidecar #${String(entityId.blobIndex)} · EIP‑4844`}
	{href}
	idDragPlainText={stringify(entityId)}
	bind:open
	{...entityViewRest}
>
	{#snippet Heading()}

		<span data-row="inline align-center gap-2 wrap">
			<span
				data-badge="small"
				data-text="font-monospace"
			>
				#{String(entityId.blobIndex)}
			</span>
			<ResourceBoundary
				resource={blob}
				placeholderText="Loading blob…"
			>
				{#snippet children(blob)}
					<small>
						<TruncatedValue
							value={blob.versionedHash}
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
			The short <strong>versioned hash</strong> shown here summarizes the cryptographic commitment validators agreed on—not contract bytecode nor log fingerprints.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={blob}
			placeholderText="Loading blob…"
		>
			{#snippet children(blob)}
				<div data-column="gap-1">
				<dl data-column-item="center">
					<div>
						<dt>Blob index</dt>
						<dd>
							<NumberValue value={entityId.blobIndex} />
						</dd>
					</div>
					{#if blob.versionedHash !== undefined}
						<div>
							<dt>Blob commitment (KZG versioned hash)</dt>
							<dd>
								<TruncatedValue
									value={blob.versionedHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
						{#if entityId.$network.chainId === ChainId.Ethereum}
							<div>
								<dt>Blobscan</dt>
								<dd>
									<a
										href={`https://blobscan.com/blob/${blob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								</dd>
							</div>
						{:else if entityId.$network.chainId === ChainId.EthereumSepolia}
							<div>
								<dt>Blobscan</dt>
								<dd>
									<a
										href={`https://sepolia.blobscan.com/blob/${blob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								</dd>
							</div>
						{:else if entityId.$network.chainId === ChainId.Gnosis}
							<div>
								<dt>Blobscan</dt>
								<dd>
									<a
										href={`https://gnosis.blobscan.com/blob/${blob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								</dd>
							</div>
						{:else if entityId.$network.chainId === 560048}
							<div>
								<dt>Blobscan</dt>
								<dd>
									<a
										href={`https://hoodi.blobscan.com/blob/${blob.versionedHash}`}
										data-text="small"
										target="_blank"
										rel="noreferrer"
									>Open explorer</a>
								</dd>
							</div>
						{/if}
					{/if}

					{#if blob.blobscanBlobJson !== undefined}
						<div>
							<dt>Blobscan indexer payload</dt>
							<dd data-column="gap-1">
								<div data-row="wrap align-start gap-2">
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={blob.blobscanBlobJson}
									/>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p><code>{'GET /blobs/{versionedHash}'}</code> JSON from the Blobscan REST API (commitment, proof, sizes, storage references). Only on chains their indexer hosts.</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Blobscan indexer payload"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							</dd>
						</div>
					{/if}

					{#if open}
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
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<EntityDetails
			entityType={EntityType.EvmBlob}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${blobIdKey}:carousel-blob`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<Heading>Type‑3 execution payload</Heading>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Blob primer"
						href={`#${blobIdKey}:blob-semantics`}
					>Consensus + execution roles</a>
					{#if _children}
						<a
							data-scroll-marker-label="Route"
							href={`#${blobIdKey}:page-content`}
						>Route</a>
					{/if}
				{/snippet}

				{#snippet body(_ctx)}
					<section
						id={`${blobIdKey}:blob-semantics`}
					>
						<div data-row="wrap align-center gap-2">
							<span data-text="annotation">Consensus + execution roles</span>
							<Tooltip contentProps={{ side: 'top' }}>
								{#snippet Content()}
									<p>Blobs extend execution payloads with large binaries whose integrity is proved via KZG commitments — versioned hashes bind each sidecar to a succinct witness apart from execution gas; EIP‑4844 blob gas and pruning follow their own schedule while rollups may persist data off-chain.</p>
								{/snippet}
								<abbr
									class="entity-heading-tip"
									aria-label="Blob semantics"
								>ⓘ</abbr>
							</Tooltip>
						</div>
					</section>

					{#if _children}
						<section
							id={`${blobIdKey}:page-content`}
						>
							{@render _children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
