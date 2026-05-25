<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Props
	let {
		entityId,
		href = ipfsResourceHref(entityId),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.IpfsResource>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { ipfsResourceCanonicalUri, ipfsResourceHref } from '$/lib/ipfs.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.target}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
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
		<dl data-column-item="center">
			<div>
				<dt>Content type</dt>
				<dd>
					<ResourceBoundary resource={ipfs}>
						{#snippet children(loadedIpfs)}
							{#if loadedIpfs.contentType !== undefined}
								<TruncatedValue
									value={loadedIpfs.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if loadedIpfs.isContentTypeInferred}
									{' '}<span data-text="muted">(inferred)</span>
								{/if}
							{:else if !open}
								<span data-text="muted">Content type unavailable.</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Canonical URI</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								<TruncatedValue
									value={loadedIpfs.canonicalUri}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Gateway</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								<TruncatedValue
									value={loadedIpfs.gatewayOrigin}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Gateway URL</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								<a
									href={loadedIpfs.gatewayUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue
										value={loadedIpfs.gatewayUrl}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Content length</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								{#if loadedIpfs.contentLength !== undefined}
									<NumberValue
										value={loadedIpfs.contentLength}
										options={{ maximumFractionDigits: 0 }}
									/>
									{' '}
									bytes
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>File name</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								{#if loadedIpfs.fileName !== undefined}
									<TruncatedValue
										value={loadedIpfs.fileName}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Extension</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								{#if loadedIpfs.extension !== undefined}
									.{loadedIpfs.extension}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Display type</dt>
					<dd>
						<ResourceBoundary resource={ipfs}>
							{#snippet children(loadedIpfs)}
								{loadedIpfs.displayType}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				{#if entityId.namespace === 'ipfs'}
					<div>
						<dt>Content identifier version</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(loadedIpfs)}
									{#if loadedIpfs.cidVersion !== undefined}
										{String(ipfs.cidVersion)}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
					<div>
						<dt>Multibase</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(loadedIpfs)}
									{#if loadedIpfs.cidMultibase !== undefined}
										<TruncatedValue
											value={loadedIpfs.cidMultibase}
											format={TruncatedValueFormat.Visual}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Multicodec code</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(loadedIpfs)}
									{#if loadedIpfs.cidMulticodecCode !== undefined}
										{String(ipfs.cidMulticodecCode)}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Multihash code</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(loadedIpfs)}
									{#if loadedIpfs.cidMultihashCode !== undefined}
										{String(ipfs.cidMultihashCode)}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Multihash digest</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(loadedIpfs)}
									{#if loadedIpfs.cidMultihashDigestHex !== undefined}
										<TruncatedValue
											value={loadedIpfs.cidMultihashDigestHex}
											format={TruncatedValueFormat.Visual}
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<div>
						<dt>Subdomain-safe</dt>
						<dd>
							<ResourceBoundary resource={ipfs}>
								{#snippet children(loadedIpfs)}
									{#if loadedIpfs.isCidSubdomainSafe !== undefined}
										{loadedIpfs.isCidSubdomainSafe ? 'Yes' : 'No'}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
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

				{#snippet body({ open: _paneOpen })}
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
								{#snippet children(loadedIpfs)}
									<FileDetails
										contentSize={loadedIpfs.contentLength}
										contentType={loadedIpfs.contentType}
										displayType={loadedIpfs.displayType}
										extension={loadedIpfs.extension}
										fileName={loadedIpfs.fileName}
										src={loadedIpfs.gatewayUrl}
										text={loadedIpfs.text}
									/>
								{/snippet}
							</ResourceBoundary>
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>

