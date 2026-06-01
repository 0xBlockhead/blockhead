<script lang="ts">
	// Types/constants
	import type { Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import {
		getResourceCanonicalUri,
		getResourceHref,
	} from '$/sources/Swarm/Rest/queries.ts'

	import { stringify } from 'devalue'


	// State
	let {
		entityId,
		Form,
		open = $bindable(true),
	}: {
		entityId: EntityId<typeof schema, EntityType.SwarmResource>
		Form: Snippet
		open?: boolean
	} = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const swarm = useEntity(
		EntityType.SwarmResource,
		entityId,
		{
			$: [Source.Swarm_Rest],
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
			...(open && {
				$media: {},
			}),
		},
	)


	const swarmChromeKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Media from '$/components/Media.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	layout={EntityLayout.Details}
	entityType={EntityType.SwarmResource}
	{entityId}
	title={getResourceCanonicalUri(entityId)}
	bind:open
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Swarm content is addressed by <code>bzz</code> root hashes and optional manifest paths—not IPFS CIDs.
		</p>
		<p>
			Gateways translate those references into HTTPS fetches for browsing.
		</p>
	{/snippet}

	{#snippet Content()}
		{#if true}
			{#snippet SwarmChromeContentTypeRow(swarm)}
				{#if swarm.contentType !== undefined}
					<TruncatedValue
						value={swarm.contentType}
						format={TruncatedValueFormat.Visual}
					/>
					{#if swarm.isContentTypeInferred}
						{' '}
						<span data-text="muted">(inferred)</span>
					{/if}
				{/if}
			{/snippet}

			<ResourceBoundary
				children={SwarmChromeContentTypeRow}
				placeholderText="Loading Swarm resource…"
				resource={swarm}
			/>
		{/if}
	{/snippet}

	{#snippet Details({ open })}
		<CollapsibleTabs
				id={`${swarmChromeKey}:carousel-browser`}
				sectionIdPrefix={swarmChromeKey}
				sections={[
					{ id: 'swarm-browser-form', label: 'Reference & path' },
					{ id: 'swarm-browser-note', label: 'Current resource' },
					{ id: 'swarm-metadata', label: 'Metadata' },
					{ id: 'swarm-content', label: 'Content' },
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
							Browse
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionSwarmBrowserForm()}
					<section
						class="swarm-browser"
						data-column
					>
						{@render Form()}
					</section>
				{/snippet}

				{#snippet SectionSwarmBrowserNote()}
					<section
						class="swarm-browser-note"
						data-card
						data-column
					>
						<header data-row="wrap align-center gap-2">
							<h2>Browse Swarm</h2>
							<Tooltip
								content="You are viewing one BZZ reference; the canonical URI and gateway link below resolve to the same logical object."
								contentProps={{ side: 'top' }}
							>
								<abbr
									class="entity-heading-tip"
									aria-label="Canonical URI and gateway"
								>ⓘ</abbr>
							</Tooltip>
						</header>

						<p>
							<code>
								<TruncatedValue
									value={getResourceCanonicalUri(entityId)}
									format={TruncatedValueFormat.Visual}
								/>
							</code>
						</p>
					</section>
				{/snippet}

				{#snippet SectionSwarmMetadata()}
					<section
						data-card
						data-column
					>
						<header data-row="wrap align-center gap-2">
							<h2>Metadata</h2>
						</header>

						{#snippet SwarmChromeMetadataBody(swarm)}
							<div>
								{#if swarm.canonicalUri !== undefined}
									<div>
										<dt>Canonical URI</dt>
										<dd>
											<TruncatedValue
												value={swarm.canonicalUri}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if swarm.gatewayOrigin !== undefined}
									<div>
										<dt>Gateway origin</dt>
										<dd>
											<TruncatedValue
												value={swarm.gatewayOrigin}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if swarm.gatewayUrl !== undefined}
									<div>
										<dt>Gateway URL</dt>
										<dd>
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
										</dd>
									</div>
								{/if}

								{#if swarm.contentLength !== undefined}
									<div>
										<dt>Content length</dt>
										<dd>
											<NumberValue
												value={swarm.contentLength}
												options={{ maximumFractionDigits: 0 }}
											/>
											{' '}
											bytes
										</dd>
									</div>
								{/if}

								{#if swarm.fileName !== undefined}
									<div>
										<dt>File name</dt>
										<dd>
											<TruncatedValue
												value={swarm.fileName}
												format={TruncatedValueFormat.Visual}
											/>
										</dd>
									</div>
								{/if}

								{#if swarm.extension !== undefined}
									<div>
										<dt>Extension</dt>
										<dd>.{swarm.extension}</dd>
									</div>
								{/if}

								{#if swarm.contentType !== undefined}
									<div>
										<dt>Content type</dt>
										<dd>
											<TruncatedValue
												value={swarm.contentType}
												format={TruncatedValueFormat.Visual}
											/>
											{#if swarm.isContentTypeInferred}
												{' '}
												<span data-text="muted">(inferred)</span>
											{/if}
										</dd>
									</div>
								{/if}

								{#if swarm.displayType !== undefined}
									<div>
										<dt>Display type</dt>
										<dd>{swarm.displayType}</dd>
									</div>
								{/if}
							</div>
						{/snippet}

						<ResourceBoundary
							children={SwarmChromeMetadataBody}
							placeholderText="Loading metadata…"
							resource={swarm}
						/>
					</section>
				{/snippet}

				{#snippet SectionSwarmContent()}
					<section
						data-card
						data-column
					>
						<header data-row="wrap align-center gap-2">
							<h2>Content</h2>
						</header>

						{#snippet SwarmChromeTextBody(swarm)}
							{#if swarm.text !== undefined}
								<pre>{swarm.text}</pre>
							{:else if swarm.$media?.[EntityMetaKey.Id].url !== undefined}
								<Media
									media={{ url: swarm.$media[EntityMetaKey.Id].url }}
									alt={swarm.fileName ?? ''}
								/>
							{:else}
								<p data-text="muted">No text or media preview available.</p>
							{/if}
						{/snippet}

						<ResourceBoundary
							children={SwarmChromeTextBody}
							placeholderText="Loading content…"
							resource={swarm}
						/>
					</section>
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>


<style>
	.swarm-browser {
		gap: 1rem;
	}

	.swarm-browser-note {
		gap: 1rem;
		padding: 1rem;
	}
</style>
