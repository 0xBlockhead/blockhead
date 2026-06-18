<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityProxyCurrent } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	type SwarmResource = EntityProxyCurrent<typeof schema, EntityType.SwarmResource>


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = (
			selector.contentPath.replace(/^\/+|\/+$/g, '') === '' ?
				resolve('/(explore)/(swarm)/swarm/[reference]', {
					reference: selector.reference.trim().toLowerCase().replace(/^0x/, '').replace(/^\/+|\/+$/g, ''),
				})
			:
				resolve('/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]', {
					reference: selector.reference.trim().toLowerCase().replace(/^0x/, '').replace(/^\/+|\/+$/g, ''),
					contentPath: selector.contentPath.replace(/^\/+|\/+$/g, ''),
				})
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.SwarmResource>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const swarm = $derived(
		select(EntityType.SwarmResource,
			selector,
			({ sources: [Source.Swarm_Rest], fields: { canonicalUri: true, fileName: true, extension: true, gatewayOrigin: true, gatewayUrl: true, contentType: true, contentLength: true, displayType: true, isContentTypeInferred: true, text: true, ...(open && ({ $media: true })) } }),
		),
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
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{selector.reference}
		</span>
	{/snippet}

	{#snippet Title()}
		{#if href}
			<a
				{href}>
				<TruncatedValue
					value={`bzz://${selector.reference}${selector.contentPath === '' ? '' : `/${selector.contentPath}`}`}
					format={TruncatedValueFormat.Visual}
				/>
			</a>
		{:else}
			<TruncatedValue
				value={`bzz://${selector.reference}${selector.contentPath === '' ? '' : `/${selector.contentPath}`}`}
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
						{#snippet SwarmContentTypeRow(swarm: SwarmResource)}
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
							{#snippet SwarmCanonicalUriRow(swarm: SwarmResource)}
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
							{#snippet SwarmGatewayOriginRow(swarm: SwarmResource)}
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
							{#snippet SwarmGatewayUrlRow(swarm: SwarmResource)}
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
							{#snippet SwarmContentLengthRow(swarm: SwarmResource)}
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
							{#snippet SwarmFileNameRow(swarm: SwarmResource)}
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
							{#snippet SwarmExtensionRow(swarm: SwarmResource)}
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
							{#snippet SwarmDisplayTypeRow(swarm: SwarmResource)}
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
		{@const detailKey = stringify(selector)}
		<CollapsibleTabs
			id={`${detailKey}:carousel-swarm-resource`}
			sectionIdPrefix={detailKey}
			sections={collapsibleTabsSections(
				_open ?
					[
						{ id: 'swarm-browse', label: 'Browse' },
						{ id: 'swarm-preview', label: 'Preview' },
					]
				:
					[
						{ id: 'swarm-browse', label: 'Browse' },
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
				<SwarmBrowseForm {selector} />
			{/snippet}

			{#snippet SectionSwarmPreview()}
				{#snippet SwarmPreviewBody(swarm: SwarmResource)}
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
