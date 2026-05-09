<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { IpfsDisplayType } from '$/lib/contentType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { ipfsResourceCanonicalUri } from '$/lib/ipfs.ts'
	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


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


	// Functions
	const ipfsDisplayType = (value: JsonValue): IpfsDisplayType | undefined => (
		value === 'text'
		|| value === 'image'
		|| value === 'video'
		|| value === 'audio'
		|| value === 'json'
		|| value === 'xml'
		|| value === 'pdf'
		|| value === 'iframe'
		|| value === 'binary' ?
			value
		:
			undefined
	)


	// (Derived)
	const resourceIdKey = $derived(
		stringify(entityId),
	)

	const displayTitle = $derived(
		ipfsResourceCanonicalUri(entityId),
	)

	const resourceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.IpfsResource] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						resourceIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => resourceIdKey],
	)

	const resourceRow = $derived(
		(
			resourceQuery.data?.find(
				({ row }) => row[EntityMetaKey.Source] === Source.Ipfs_Rest,
			)?.row
			?? resourceQuery.data?.[0]?.row
		),
	)

	const resourceField = $derived(
		(() => {
			const bag = resourceRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
			const b = bag
			return {
				canonicalUri: typeof b.canonicalUri === 'string' && b.canonicalUri.length > 0 ? b.canonicalUri : undefined,
				fileName: typeof b.fileName === 'string' && b.fileName.length > 0 ? b.fileName : undefined,
				extension: typeof b.extension === 'string' && b.extension.length > 0 ? b.extension : undefined,
				gatewayOrigin: typeof b.gatewayOrigin === 'string' && b.gatewayOrigin.length > 0 ? b.gatewayOrigin : undefined,
				gatewayUrl: typeof b.gatewayUrl === 'string' && b.gatewayUrl.length > 0 ? b.gatewayUrl : undefined,
				contentType: typeof b.contentType === 'string' && b.contentType.length > 0 ? b.contentType : undefined,
				contentLength: typeof b.contentLength === 'number' && Number.isFinite(b.contentLength) ? b.contentLength : undefined,
				displayType: ipfsDisplayType(b.displayType),
				isContentTypeInferred: typeof b.isContentTypeInferred === 'boolean' ? b.isContentTypeInferred : undefined,
				text: typeof b.text === 'string' ? b.text : undefined,
				cidVersion: typeof b.cidVersion === 'number' && Number.isFinite(b.cidVersion) ? b.cidVersion : undefined,
				cidMultibase: typeof b.cidMultibase === 'string' && b.cidMultibase.length > 0 ? b.cidMultibase : undefined,
				cidMulticodecCode: typeof b.cidMulticodecCode === 'number' && Number.isFinite(b.cidMulticodecCode) ? b.cidMulticodecCode : undefined,
				cidMultihashCode: typeof b.cidMultihashCode === 'number' && Number.isFinite(b.cidMultihashCode) ? b.cidMultihashCode : undefined,
				cidMultihashDigestHex: typeof b.cidMultihashDigestHex === 'string' && b.cidMultihashDigestHex.length > 0 ? b.cidMultihashDigestHex : undefined,
				isCidSubdomainSafe: typeof b.isCidSubdomainSafe === 'boolean' ? b.isCidSubdomainSafe : undefined,
			}
		})(),
	)


	// Components
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import IpfsCidAlternateEncodings from '$/views/IpfsCidAlternateEncodings.svelte'
</script>


<EntityView
	entityType={EntityType.IpfsResource}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Heading()}
		<HeadingComponent>
			{#if href}
				<a
					{href}
				>
					<TruncatedValue
						value={displayTitle}
						format={TruncatedValueFormat.Visual}
					/>
				</a>
			{:else}
				<TruncatedValue
					value={displayTitle}
					format={TruncatedValueFormat.Visual}
				/>
			{/if}
		</HeadingComponent>
	{/snippet}

	{#snippet Content()}
		{#if resourceField?.contentType !== undefined}
			<dl>
				<div>
					<dt>Content type</dt>
					<dd>
						<TruncatedValue
							value={resourceField.contentType}
							format={TruncatedValueFormat.Visual}
						/>
						{#if resourceField.isContentTypeInferred}
							{' '}<span data-text="muted">(inferred)</span>
						{/if}
					</dd>
				</div>
			</dl>
		{/if}
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.IpfsResource}
			{entityId}
		>
			{#if entityId.namespace === 'ipfs'}
				<IpfsCidAlternateEncodings
					contentPath={entityId.contentPath}
					target={entityId.target}
				/>
			{/if}

			<QueryBoundary
				query={resourceQuery}
			>
				{#snippet children(rows)}
					{@const resourceRow = (
						rows?.find(
							({ row }) => row[EntityMetaKey.Source] === Source.Ipfs_Rest,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if resourceRow === undefined || resourceField === undefined}
						<p data-text="muted">
							No IPFS content for this URI yet. Try again shortly.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Canonical URI</dt>
								<dd>
									<TruncatedValue
										value={resourceField.canonicalUri ?? displayTitle}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>

							{#if resourceField.gatewayOrigin !== undefined}
								<div>
									<dt>Gateway</dt>
									<dd>
										<TruncatedValue
											value={resourceField.gatewayOrigin}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if resourceField.gatewayUrl !== undefined}
								<div>
									<dt>Gateway URL</dt>
									<dd>
										<a
											href={resourceField.gatewayUrl}
											target="_blank"
											rel="noreferrer noopener"
										>
											<TruncatedValue
												value={resourceField.gatewayUrl}
												format={TruncatedValueFormat.Visual}
											/>
										</a>
									</dd>
								</div>
							{/if}

							{#if resourceField.contentLength !== undefined}
								<div>
									<dt>Content length</dt>
									<dd
									>
										<NumberValue
											value={resourceField.contentLength}
											options={{ maximumFractionDigits: 0 }}
										/>
										{' '}
										bytes
									</dd>
								</div>
							{/if}
							{#if resourceField.fileName !== undefined}
								<div>
									<dt>File name</dt>
									<dd>
										<TruncatedValue
											value={resourceField.fileName}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
							{#if resourceField.extension !== undefined}
								<div>
									<dt>Extension</dt>
									<dd>.{resourceField.extension}</dd>
								</div>
							{/if}
							{#if resourceField.displayType !== undefined}
								<div>
									<dt>Display type</dt>
									<dd>{resourceField.displayType}</dd>
								</div>
							{/if}
						</dl>

						{#if entityId.namespace === 'ipfs' && resourceField.cidVersion !== undefined}
							<dl>
								<div>
									<dt>CID version</dt>
									<dd>{String(resourceField.cidVersion)}</dd>
								</div>
								{#if resourceField.cidMultibase !== undefined}
									<div>
										<dt>Multibase</dt>
										<dd>
											<TruncatedValue
												value={resourceField.cidMultibase}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}
								{#if resourceField.cidMulticodecCode !== undefined}
									<div>
										<dt>Multicodec code</dt>
										<dd>{String(resourceField.cidMulticodecCode)}</dd>
									</div>
								{/if}
								{#if resourceField.cidMultihashCode !== undefined}
									<div>
										<dt>Multihash code</dt>
										<dd>{String(resourceField.cidMultihashCode)}</dd>
									</div>
								{/if}
								{#if resourceField.cidMultihashDigestHex !== undefined}
									<div>
										<dt>Digest</dt>
										<dd>
											<TruncatedValue
												value={resourceField.cidMultihashDigestHex}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}
								{#if resourceField.isCidSubdomainSafe !== undefined}
									<div>
										<dt>Subdomain-safe</dt>
										<dd>{resourceField.isCidSubdomainSafe ? 'Yes' : 'No'}</dd>
									</div>
								{/if}
							</dl>
						{/if}

						{#if resourceField.displayType !== undefined}
							<FileDetails
								contentSize={resourceField.contentLength}
								contentType={resourceField.contentType}
								displayType={resourceField.displayType}
								extension={resourceField.extension}
								fileName={resourceField.fileName}
								src={resourceField.gatewayUrl}
								text={resourceField.text}
							/>
						{/if}
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
