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

	import {
		swarmResourceCanonicalUri,
	} from '$/sources/Swarm/Rest/queries.ts'
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
			entityId: EntityId<typeof schema, EntityType.SwarmResource>
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
	const ipfsDisplayType = (value: JsonValue | undefined): IpfsDisplayType | undefined => (
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
		swarmResourceCanonicalUri(entityId),
	)

	const resourceQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.SwarmResource] })
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
				({ row }) => row[EntityMetaKey.Source] === Source.Swarm_Rest,
			)?.row
			?? resourceQuery.data?.[0]?.row
		),
	)

	const resourceField = $derived(
		(() => {
			const bag = resourceRow?.[EntityMetaKey.Fields]
			if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return undefined
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
</script>


<EntityView
	entityType={EntityType.SwarmResource}
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
			entityType={EntityType.SwarmResource}
			{entityId}
		>
			<QueryBoundary
				query={resourceQuery}
			>
				{#snippet children(rows)}
					{@const resourceRow = (
						rows?.find(
							({ row }) => row[EntityMetaKey.Source] === Source.Swarm_Rest,
						)?.row
						?? rows?.[0]?.row
					)}
					{#if resourceRow === undefined || resourceField === undefined}
						<p data-text="muted">
							No Swarm content for this URI yet. Try again shortly.
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
