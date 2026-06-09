<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		getResourceCanonicalUri,
		normalizeReference,
	} from '$/sources/Swarm/Rest/queries.ts'

	import { stringify } from 'devalue'

	type ResourceFields = {
		fields: Record<string, any>
	}


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
			entityId,
			href = (
				entityId.contentPath.replace(/^\/+|\/+$/g, '') === '' ?
					resolve('/(explore)/(swarm)/swarm/[reference]', {
						reference: normalizeReference(entityId.reference),
					})
				:
					resolve('/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]', {
						reference: normalizeReference(entityId.reference),
						contentPath: entityId.contentPath.replace(/^\/+|\/+$/g, ''),
					})
			),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SwarmResource>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const swarm = useEntity(entityCollectionsContext, EntityType.SwarmResource,
		entityId,
		({ sources: [Source.Swarm_Rest], fields: { canonicalUri: true, fileName: true, extension: true, gatewayOrigin: true, gatewayUrl: true, contentType: true, contentLength: true, displayType: true, isContentTypeInferred: true, text: true, ...(open && ({ $media: true })) } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import SwarmBrowseForm from '$/views/SwarmBrowseForm.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmResource}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.reference}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if href}
			<a
				{href}>
				<TruncatedValue
					value={getResourceCanonicalUri(entityId)}
					format={TruncatedValueFormat.Visual}
				/>
			</a>
		{:else}
			<TruncatedValue
				value={getResourceCanonicalUri(entityId)}
				format={TruncatedValueFormat.Visual}
			/>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Swarm stores content in a distributed chunk network addressed by <code>bzz</code> URIs.
		</p>
		<p>
			What you see here is the object behind that reference, often fetched via an HTTP gateway for display.
		</p>
	{/snippet}

	{#snippet Content({ open })}
		<dl data-column-item="center">
			<div>
				<dt>Content type</dt>
				<dd>
					{#if true}
						{#snippet SwarmContentTypeRow(swarm: ResourceFields)}
							{#if swarm.fields.contentType !== undefined}
								<TruncatedValue
									value={swarm.fields.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if swarm.fields.isContentTypeInferred}
									{' '}<span data-text="muted">(inferred)</span>
								{/if}
							{:else if !open}
								<span data-text="muted">Content type unavailable.</span>
							{/if}
						{/snippet}

						<ResourceBoundary
							children={SwarmContentTypeRow}
							resource={swarm}
						/>
					{/if}
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Canonical URI</dt>
					<dd>
						{#if true}
							{#snippet SwarmCanonicalUriRow(swarm: ResourceFields)}
								<TruncatedValue
									value={swarm.fields.canonicalUri}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}

							<ResourceBoundary
								children={SwarmCanonicalUriRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Gateway</dt>
					<dd>
						{#if true}
							{#snippet SwarmGatewayOriginRow(swarm: ResourceFields)}
								<TruncatedValue
									value={swarm.fields.gatewayOrigin}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}

							<ResourceBoundary
								children={SwarmGatewayOriginRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Gateway URL</dt>
					<dd>
						{#if true}
							{#snippet SwarmGatewayUrlRow(swarm: ResourceFields)}
								<a
									href={swarm.fields.gatewayUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue
										value={swarm.fields.gatewayUrl}
										format={TruncatedValueFormat.Visual}
									/>
								</a>
							{/snippet}

							<ResourceBoundary
								children={SwarmGatewayUrlRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Content length</dt>
					<dd>
						{#if true}
							{#snippet SwarmContentLengthRow(swarm: ResourceFields)}
								{#if swarm.fields.contentLength !== undefined}
									<NumberValue
										value={swarm.fields.contentLength}
										options={{ maximumFractionDigits: 0 }}
									/>
									{' '}
									bytes
								{/if}
							{/snippet}

							<ResourceBoundary
								children={SwarmContentLengthRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>File name</dt>
					<dd>
						{#if true}
							{#snippet SwarmFileNameRow(swarm: ResourceFields)}
								{#if swarm.fields.fileName !== undefined}
									<TruncatedValue
										value={swarm.fields.fileName}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}

							<ResourceBoundary
								children={SwarmFileNameRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Extension</dt>
					<dd>
						{#if true}
							{#snippet SwarmExtensionRow(swarm: ResourceFields)}
								{#if swarm.fields.extension !== undefined}
									.{swarm.fields.extension}
								{/if}
							{/snippet}

							<ResourceBoundary
								children={SwarmExtensionRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>

				<div>
					<dt>Display type</dt>
					<dd>
						{#if true}
							{#snippet SwarmDisplayTypeRow(swarm: ResourceFields)}
								{swarm.fields.displayType}
							{/snippet}

							<ResourceBoundary
								children={SwarmDisplayTypeRow}
								resource={swarm}
							/>
						{/if}
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const detailKey = stringify(entityId)}
		<CollapsibleTabs
			id={`${detailKey}:carousel-swarm-resource`}
			sectionIdPrefix={detailKey}
			sections={collapsibleTabsSections(
				_open ?
					[
						{ id: 'swarm-browse', label: 'Browse' },
						{ id: 'swarm-record', label: 'Record' },
						{ id: 'swarm-preview', label: 'Preview' },
					]
				:
					[
						{ id: 'swarm-browse', label: 'Browse' },
						{ id: 'swarm-record', label: 'Record' },
					],
			)}
			data-card
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
				</header>
			{/snippet}

			{#snippet SectionSwarmBrowse()}
				<SwarmBrowseForm {entityId} />
			{/snippet}

			{#snippet SectionSwarmRecord()}
			{/snippet}

			{#snippet SectionSwarmPreview()}
				{#snippet SwarmPreviewBody(swarm: ResourceFields)}
					{#if swarm.fields.displayType !== undefined}
					<FileDetails
						contentSize={swarm.fields.contentLength}
						contentType={swarm.fields.contentType}
						displayType={swarm.fields.displayType}
						extension={swarm.fields.extension}
						fileName={swarm.fields.fileName}
						src={swarm.fields.gatewayUrl}
						text={swarm.fields.text}
					/>
					{/if}
				{/snippet}

				<ResourceBoundary
					children={SwarmPreviewBody}
					resource={swarm}
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
