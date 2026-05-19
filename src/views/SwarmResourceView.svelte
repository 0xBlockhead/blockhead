<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'

	import {
		swarmResourceCanonicalUri,
	} from '$/sources/Swarm/Rest/queries.ts'


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


	// State
	import { stringify } from 'devalue'

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
			...(open && {
				text: {},
				$media: {},
			}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SwarmResource}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.reference}
		</span>
	{/snippet}

	{#snippet Heading()}
		<TruncatedValue
			value={swarmResourceCanonicalUri(entityId)}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Swarm stores content in a distributed chunk network addressed by <code>bzz</code> URIs.
				</p>
				<p>
					What you see here is the object behind that reference, often fetched via an HTTP gateway for display.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={swarm}>
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
						{/if}

						{#if open}
							<div>
								<dt>Gateway</dt>
								<dd>
									<TruncatedValue
										value={loaded.gatewayOrigin}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}

						{#if open}
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
						{/if}

						{#if open}
							{#if loaded.contentLength !== undefined}
								<div>
									<dt>Content length</dt>
									<dd>
										<NumberValue
											value={loaded.contentLength}
											options={{ maximumFractionDigits: 0 }}
										/>
										{' '}
										bytes
									</dd>
								</div>
							{/if}
						{/if}

						{#if open}
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
						{/if}

						{#if open}
							{#if loaded.extension !== undefined}
								<div>
									<dt>Extension</dt>
									<dd>.{loaded.extension}</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							<div>
								<dt>Display type</dt>
								<dd>{loaded.displayType}</dd>
							</div>
						{/if}

						{#if open}
							{#if loaded.text !== undefined}
								<div>
									<dt>Text</dt>
									<dd>
										<TruncatedValue
											value={loaded.text}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							{#if loaded.$media?.[EntityMetaKey.Id].url !== undefined}
								<div>
									<dt>Media</dt>
									<dd>
										<Media
											media={{ url: loaded.$media[EntityMetaKey.Id].url }}
											alt={loaded.fileName ?? ''}
										/>
									</dd>
								</div>
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
				id={`${detailKey}:carousel-swarm-resource`}
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
									Swarm stores content in a distributed chunk network addressed by bzz URIs.
								</p>
								<p>
									What you see here is the object behind that reference, often fetched via an HTTP gateway for display.
								</p>
							{/snippet}
							<abbr
								class="entity-heading-tip"
								aria-label="Swarm resource notes"
							>ⓘ</abbr>
						</Tooltip>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${detailKey}:swarm-record`}
					>Record</a>
					{#if _open}
						<a
							data-scroll-marker-label="Content"
							href={`#${detailKey}:swarm-content`}
						>Content</a>
						<a
							data-scroll-marker-label="Media"
							href={`#${detailKey}:swarm-media`}
						>Media</a>
					{/if}
				{/snippet}

				{#snippet children({
					open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`${detailKey}:swarm-record`}
					>
						<EntityDetails
							entityType={EntityType.SwarmResource}
							{entityId}
						/>
					</section>
					{#if _open}
						<section
							data-scroll-marker-label="Content"
							id={`${detailKey}:swarm-content`}
						>
							<ResourceBoundary resource={swarm}>
								{#snippet children(loaded)}
									{#if loaded.text !== undefined}
										<pre>{loaded.text}</pre>
									{:else}
										<p data-text="muted">No text content.</p>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</section>
						<section
							data-scroll-marker-label="Media"
							id={`${detailKey}:swarm-media`}
						>
							<ResourceBoundary resource={swarm}>
								{#snippet children(loaded)}
									{#if loaded.$media?.[EntityMetaKey.Id].url !== undefined}
										<Media
											media={{ url: loaded.$media[EntityMetaKey.Id].url }}
											alt={loaded.fileName ?? ''}
										/>
									{:else}
										<p data-text="muted">No media content.</p>
									{/if}
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
