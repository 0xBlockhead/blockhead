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

	const ipfs = useEntity(
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
		<ResourceBoundary resource={ipfs}>
			{#snippet children(ipfs)}
				{#if ipfs.contentType !== undefined || open}
					<dl data-column-item="center">
						{#if ipfs.contentType !== undefined}
							<div>
								<dt>Content type</dt>
								<dd>
									<TruncatedValue
										value={ipfs.contentType}
										format={TruncatedValueFormat.Visual}
									/>
									{#if ipfs.isContentTypeInferred}
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
										value={ipfs.canonicalUri}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							<div>
								<dt>Gateway</dt>
								<dd>
									<TruncatedValue
										value={ipfs.gatewayOrigin}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							<div>
								<dt>Gateway URL</dt>
								<dd>
									<a
										href={ipfs.gatewayUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue
											value={ipfs.gatewayUrl}
											format={TruncatedValueFormat.Visual}
										/>
									</a>
								</dd>
							</div>

							{#if ipfs.contentLength !== undefined}
								<div>
									<dt>Content length</dt>
									<dd
									>
										<NumberValue
											value={ipfs.contentLength}
											options={{ maximumFractionDigits: 0 }}
										/>
										{' '}
										bytes
									</dd>
								</div>
							{/if}

							{#if ipfs.fileName !== undefined}
								<div>
									<dt>File name</dt>
									<dd>
										<TruncatedValue
											value={ipfs.fileName}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if ipfs.extension !== undefined}
								<div>
									<dt>Extension</dt>
									<dd>.{ipfs.extension}</dd>
								</div>
							{/if}
							<div>
								<dt>Display type</dt>
								<dd>{ipfs.displayType}</dd>
							</div>
							{#if entityId.namespace === 'ipfs'}
								{#if ipfs.cidVersion !== undefined}
									<div>
										<dt>Content identifier version</dt>
										<dd>{String(ipfs.cidVersion)}</dd>
									</div>
									{#if ipfs.cidMultibase !== undefined}
										<div>
											<dt>Multibase</dt>
											<dd>
												<TruncatedValue
													value={ipfs.cidMultibase}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.cidMulticodecCode !== undefined}
										<div>
											<dt>Multicodec code</dt>
											<dd>{String(ipfs.cidMulticodecCode)}</dd>
										</div>
									{/if}

									{#if ipfs.cidMultihashCode !== undefined}
										<div>
											<dt>Multihash code</dt>
											<dd>{String(ipfs.cidMultihashCode)}</dd>
										</div>
									{/if}

									{#if ipfs.cidMultihashDigestHex !== undefined}
										<div>
											<dt>Multihash digest</dt>
											<dd>
												<TruncatedValue
													value={ipfs.cidMultihashDigestHex}
													format={TruncatedValueFormat.Visual}
												/>
											</dd>
										</div>
									{/if}

									{#if ipfs.isCidSubdomainSafe !== undefined}
										<div>
											<dt>Subdomain-safe</dt>
											<dd>{ipfs.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
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
								resource={ipfs}
							>
								{#snippet children(ipfs)}
									<FileDetails
										contentSize={ipfs.contentLength}
										contentType={ipfs.contentType}
										displayType={ipfs.displayType}
										extension={ipfs.extension}
										fileName={ipfs.fileName}
										src={ipfs.gatewayUrl}
										text={ipfs.text}
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
