<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.IpfsResource>
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
			| 'Heading'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'

	const resourceEntity = useEntity(
		EntityType.IpfsResource,
		entityId,
		{
			$: [Source.Ipfs_Rest],
			canonicalUri: {},
			gatewayOrigin: {},
			gatewayUrl: {},
			fileName: {},
			extension: {},
			contentType: {},
			contentLength: {},
			displayType: {},
			isContentTypeInferred: {},
			text: {},
			cidVersion: {},
			cidMultibase: {},
			cidMulticodecCode: {},
			cidMultihashCode: {},
			cidMultihashDigestHex: {},
			isCidSubdomainSafe: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import IpfsCidAlternateEncodings from '$/views/IpfsCidAlternateEncodings.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.cid}
		</span>
	{/snippet}

	{#snippet Heading()}
		{#if href}
			<a
				{href}
			>
				<TruncatedValue
					value={ipfsResourceCanonicalUri(entityId)}
					format={TruncatedValueFormat.Visual}
				/>
			</a>
		{:else}
			<TruncatedValue
				value={ipfsResourceCanonicalUri(entityId)}
				format={TruncatedValueFormat.Visual}
			/>
		{/if}
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={resourceEntity}>
			{#snippet children(loaded)}
				{#if loaded.contentType !== undefined || open}
					<dl data-column-item="center">
						{#if loaded.contentType !== undefined}
							<div>
								<dt>Content type</dt>
								<dd>
									<TruncatedValue
										value={loaded.contentType}
										format={TruncatedValueFormat.Visual}
									/>
									{#if loaded.isContentTypeInferred}
										{' '}<span data-text="muted">(inferred)</span>
									{/if}
								</dd>
							</div>
						{/if}

						{#if open}
							<div>
								<dt>Canonical URI</dt>
								<dd>
									<TruncatedValue
										value={loaded.canonicalUri}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							<div>
								<dt>Gateway</dt>
								<dd>
									<TruncatedValue
										value={loaded.gatewayOrigin}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							<div>
								<dt>Gateway URL</dt>
								<dd>
									<a
										href={loaded.gatewayUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue
											value={loaded.gatewayUrl}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>

							{#if loaded.contentLength !== undefined}
								<div>
									<dt>Content length</dt>
									<dd
									>
										<NumberValue
											value={loaded.contentLength}
											options={{ maximumFractionDigits: 0 }}
										/>
										{' '}
										bytes
									</dd>
								</div>
							{/if}

							{#if loaded.fileName !== undefined}
								<div>
									<dt>File name</dt>
									<dd>
										<TruncatedValue
											value={loaded.fileName}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if loaded.extension !== undefined}
								<div>
									<dt>Extension</dt>
									<dd>.{loaded.extension}</dd>
								</div>
							{/if}
							<div>
								<dt>Display type</dt>
								<dd>{loaded.displayType}</dd>
							</div>
							{#if entityId.namespace === 'ipfs'}
								{#if loaded.cidVersion !== undefined}
									<div>
										<dt>Content identifier version</dt>
										<dd>{String(loaded.cidVersion)}</dd>
									</div>
									{#if loaded.cidMultibase !== undefined}
										<div>
											<dt>Multibase</dt>
											<dd>
												<TruncatedValue
													value={loaded.cidMultibase}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if loaded.cidMulticodecCode !== undefined}
										<div>
											<dt>Multicodec code</dt>
											<dd>{String(loaded.cidMulticodecCode)}</dd>
										</div>
									{/if}

									{#if loaded.cidMultihashCode !== undefined}
										<div>
											<dt>Multihash code</dt>
											<dd>{String(loaded.cidMultihashCode)}</dd>
										</div>
									{/if}

									{#if loaded.cidMultihashDigestHex !== undefined}
										<div>
											<dt>Multihash digest</dt>
											<dd>
												<TruncatedValue
													value={loaded.cidMultihashDigestHex}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if loaded.isCidSubdomainSafe !== undefined}
										<div>
											<dt>Subdomain-safe</dt>
											<dd>{loaded.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
										</div>
									{/if}
								{/if}
							{/if}
						{/if}
					</dl>
				{:else}
					<p data-text="muted">Content type unavailable.</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const detailKey = stringify(entityId)}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${detailKey}:carousel-ipfs-resource`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Resource
						</HeadingComponent>
						<Tooltip contentProps={{ side: 'top' }}>
							{#snippet Content()}
								<p>
									IPFS names content by content identifiers (CIDs); browsers usually load bytes through an HTTP gateway.
								</p>
								<p>
									The alternate CID encodings below are the same logical content in forms other tools expect.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="IPFS resource notes"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${detailKey}:ipfs-record`}
					>Record</a>
					{#if entityId.namespace === 'ipfs' && _open}
					<a
						data-scroll-marker-label="Encodings"
						href={`#${detailKey}:ipfs-cid`}
					>Encodings</a>
					{/if}

					{#if _open}
						<a
							data-scroll-marker-label="Preview"
							href={`#${detailKey}:ipfs-preview`}
						>Preview</a>
					{/if}
				{/snippet}

				{#snippet children({
					open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`${detailKey}:ipfs-record`}
					>
						<EntityDetails
							entityType={EntityType.IpfsResource}
							{entityId}
						/>
					</section>
					{#if _open && entityId.namespace === 'ipfs'}
						<section
							data-scroll-marker-label="CID"
							id={`${detailKey}:ipfs-cid`}
						>
							<IpfsCidAlternateEncodings
								contentPath={entityId.contentPath}
								target={entityId.target}
							/>
						</section>
					{/if}

					{#if _open}
						<section
							data-scroll-marker-label="Preview"
							id={`${detailKey}:ipfs-preview`}
						>
							<ResourceBoundary
								resource={resourceEntity}
							>
								{#snippet children(loaded)}
									<FileDetails
										contentSize={loaded.contentLength}
										contentType={loaded.contentType}
										displayType={loaded.displayType}
										extension={loaded.extension}
										fileName={loaded.fileName}
										src={loaded.gatewayUrl}
										text={loaded.text}
									/>
								{/snippet}
							</ResourceBoundary>
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
