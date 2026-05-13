<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
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
		},
	)


	// Components
	import FileDetails from '$/components/FileDetails.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
	{#snippet Heading()}
		<HeadingComponent>
			<a {href}>
				<TruncatedValue
					value={swarmResourceCanonicalUri(entityId)}
					format={TruncatedValueFormat.Visual}
				/>
			</a>
		</HeadingComponent>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary resource={swarm}>
			{#snippet children(loaded)}
				{#if loaded.contentType !== undefined}
					<dl>
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
		<EntityDetails
			entityType={EntityType.SwarmResource}
			{entityId}
		>
			<ResourceBoundary resource={swarm}>
				{#snippet children(loaded)}
					<dl>
						<div>
							<dt>Canonical URI</dt>
							<dd>
								<TruncatedValue
									value={loaded.canonicalUri}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>

						<div>
							<dt>Gateway</dt>
							<dd>
								<TruncatedValue
									value={loaded.gatewayOrigin}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>

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
						{#if loaded.extension !== undefined}
							<div>
								<dt>Extension</dt>
								<dd>.{loaded.extension}</dd>
							</div>
						{/if}
						<div>
							<dt>Display type</dt>
							<dd>{loaded.displayType}</dd>
						</div>
					</dl>

					<FileDetails
						contentSize={loaded.contentLength}
						contentType={loaded.contentType}
						displayType={loaded.displayType}
						extension={loaded.extension}
						fileName={loaded.fileName}
						src={loaded.gatewayUrl}
						text={loaded.text}
					/>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
