<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { Snippet } from 'svelte'
	import type { EntityResourceData } from '$/client/$subscribe.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'

	type SwarmResource = EntityResourceData<typeof schema, EntityType.SwarmResource>


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		Form,
		open = $bindable(true),
	}: {
		selection: EntityProxyResource<typeof schema, EntityType.SwarmResource>
		Form: Snippet
		open?: boolean
	} = $props()


	const swarm = $derived(
		selection(
			({ sources: [Source.Swarm_Rest], fields: { canonicalUri: true, gatewayOrigin: true, gatewayUrl: true, fileName: true, extension: true, contentType: true, contentLength: true, displayType: true, isContentTypeInferred: true, text: true, ...(open && ({ $media: true })) } }),
		),
	)


	// (Derived)
	const swarmChromeKey = $derived(
		stringify(selection.entitySelector),
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
	layout={EntityLayout.SummaryDetails}
	entityType={EntityType.SwarmResource}
	entitySelector={selection.entitySelector}
	title={`bzz://${selection.entitySelector.reference}${selection.entitySelector.contentPath === '' ? '' : `/${selection.entitySelector.contentPath}`}`}
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
			{#snippet SwarmChromeContentTypeRow(swarm: SwarmResource)}
				{#if swarm.fields.contentType !== undefined}
					<TruncatedValue
						value={swarm.fields.contentType}
						format={TruncatedValueFormat.Visual}
					/>
					{#if swarm.fields.isContentTypeInferred}
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
								value={`bzz://${selection.entitySelector.reference}${selection.entitySelector.contentPath === '' ? '' : `/${selection.entitySelector.contentPath}`}`}
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

					{#snippet SwarmChromeMetadataBody(swarm: SwarmResource)}
						<div>
							{#if swarm.fields.canonicalUri !== undefined}
								<div>
									<dt>Canonical URI</dt>
									<dd>
										<TruncatedValue
											value={swarm.fields.canonicalUri}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if swarm.fields.gatewayOrigin !== undefined}
								<div>
									<dt>Gateway origin</dt>
									<dd>
										<TruncatedValue
											value={swarm.fields.gatewayOrigin}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if swarm.fields.gatewayUrl !== undefined}
								<div>
									<dt>Gateway URL</dt>
									<dd>
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
									</dd>
								</div>
							{/if}

							{#if swarm.fields.contentLength !== undefined}
								<div>
									<dt>Content length</dt>
									<dd>
										<NumberValue
											value={swarm.fields.contentLength}
											options={{ maximumFractionDigits: 0 }}
										/>
										{' '}
										bytes
									</dd>
								</div>
							{/if}

							{#if swarm.fields.fileName !== undefined}
								<div>
									<dt>File name</dt>
									<dd>
										<TruncatedValue
											value={swarm.fields.fileName}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/if}

							{#if swarm.fields.extension !== undefined}
								<div>
									<dt>Extension</dt>
									<dd>.{swarm.fields.extension}</dd>
								</div>
							{/if}

							{#if swarm.fields.contentType !== undefined}
								<div>
									<dt>Content type</dt>
									<dd>
										<TruncatedValue
											value={swarm.fields.contentType}
											format={TruncatedValueFormat.Visual}
										/>
										{#if swarm.fields.isContentTypeInferred}
											{' '}
											<span data-text="muted">(inferred)</span>
										{/if}
									</dd>
								</div>
							{/if}

							{#if swarm.fields.displayType !== undefined}
								<div>
									<dt>Display type</dt>
									<dd>{swarm.fields.displayType}</dd>
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

					{#snippet SwarmChromeTextBody(swarm: SwarmResource)}
						{#if swarm.fields.text !== undefined}
							<pre>{swarm.fields.text}</pre>
						{:else if swarm.fields.$media?.[EntityMetaKey.Selector].url !== undefined}
							<Media
								media={{ url: swarm.fields.$media[EntityMetaKey.Selector].url }}
								alt={swarm.fields.fileName ?? ''}
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
