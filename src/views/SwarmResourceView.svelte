<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		swarmResourceHref,
		swarmResourceCanonicalUri,
	} from '$/sources/Swarm/Rest/queries.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
			entityId,
			href = resolve(swarmResourceHref(entityId)),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SwarmResource>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const swarm = useEntity(
		EntityType.SwarmResource,
		entityId,
		{
			$: [Source.Swarm_Rest],
			canonicalUri: {},
			fileName: {},
			extension: {},
			gatewayOrigin: {},
			gatewayUrl: {},
			contentType: {},
			contentLength: {},
			displayType: {},
			isContentTypeInferred: {},
			text: {},
			...(open && {
				$media: {},
			}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		{#if href}
			<a
			>
				<TruncatedValue
					value={swarmResourceCanonicalUri(entityId)}
					format={TruncatedValueFormat.Visual}
				/>
			</a>
		{:else}
			<TruncatedValue
				value={swarmResourceCanonicalUri(entityId)}
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

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Content type</dt>
				<dd>
					{#if true}
						{#snippet SwarmContentTypeRow(swarm)}
							{#if swarm.contentType !== undefined}
								<TruncatedValue
									value={swarm.contentType}
									format={TruncatedValueFormat.Visual}
								/>
								{#if swarm.isContentTypeInferred}
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

			{#if contentOpen}
				<div>
					<dt>Canonical URI</dt>
					<dd>
						{#if true}
							{#snippet SwarmCanonicalUriRow(swarm)}
								<TruncatedValue
									value={swarm.canonicalUri}
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
							{#snippet SwarmGatewayOriginRow(swarm)}
								<TruncatedValue
									value={swarm.gatewayOrigin}
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
							{#snippet SwarmGatewayUrlRow(swarm)}
								<a
									href={swarm.gatewayUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue
										value={swarm.gatewayUrl}
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
							{#snippet SwarmContentLengthRow(swarm)}
								{#if swarm.contentLength !== undefined}
									<NumberValue
										value={swarm.contentLength}
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
							{#snippet SwarmFileNameRow(swarm)}
								{#if swarm.fileName !== undefined}
									<TruncatedValue
										value={swarm.fileName}
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
							{#snippet SwarmExtensionRow(swarm)}
								{#if swarm.extension !== undefined}
									.{swarm.extension}
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
							{#snippet SwarmDisplayTypeRow(swarm)}
								{swarm.displayType}
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
				sections={[
					{ id: 'swarm-browse', label: 'Browse' },
					{ id: 'swarm-record', label: 'Record' },
					...(_open ? [{ id: 'swarm-preview', label: 'Preview' }] : []),
				]}
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
					{#snippet SwarmPreviewBody(swarm)}
						<FileDetails
							contentSize={swarm.contentLength}
							contentType={swarm.contentType}
							displayType={swarm.displayType}
							extension={swarm.extension}
							fileName={swarm.fileName}
							src={swarm.gatewayUrl}
							text={swarm.text}
						/>
					{/snippet}

					<ResourceBoundary
						children={SwarmPreviewBody}
						resource={swarm}
					/>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
