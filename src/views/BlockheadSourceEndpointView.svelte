<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadSourceEndpoint> = $props()

	const blockheadSourceEndpointLatestResource1 = $derived(
		selection
			.$$timestamps({
				sources: [
					Source.Local_Internal,
				],
				fields: {
					timestampMs: true,
					available: true,
					reachable: true,
					latencyMs: true,
					statusCode: true,
					error: true,
					rateLimitRemaining: true,
					rateLimitResetMs: true,
				},
				limit: 1,
				orderBy: [
					[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
				],
			})
	)

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Local_Internal,
		],
	}))
	const blockheadSourceEndpoint = $derived(viewSelection({
		fields: {
			endpointUrl: true,
			apiFamily: true,
			wireProtocol: true,
			targetKey: true,
		},
	}))
	const titleFallback = $derived((prefetched.endpointUrl ?? '') || 'source endpoint')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSourceEndpoint_TimestampsView from '$/views/BlockheadSourceEndpoint_TimestampsView.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
	import BlockheadSourceEndpoint_TimestampView from '$/views/BlockheadSourceEndpoint_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSourceEndpoint}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/manage/source/[sourceId=stringSegment]/(blockheadSource)/endpoint/[bindingId=stringSegment]/[endpointIndex=nonNegativeInteger]',
				{
					sourceId: selection.entitySelector.$source.id,
					bindingId: encodeURIComponent(selection.entitySelector.bindingId),
					endpointIndex: String(selection.entitySelector.endpointIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSourceEndpoint}>
			{#snippet children(entity)}
				{entity.endpointUrl || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSourceEndpoint}>
			{#snippet children(entity)}
				{[entity.apiFamily, entity.wireProtocol].filter(Boolean).join(' ') || entity.endpointUrl || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSourceEndpoint}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.targetKey}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest health</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpointLatestResource1}
					>
						{#snippet children(blockheadSourceEndpointTimestamps)}
							{@const blockheadSourceEndpointTimestamp = blockheadSourceEndpointTimestamps.values[0]}
							{#if blockheadSourceEndpointTimestamp != null}
								<BlockheadSourceEndpoint_TimestampView
									selection={
										select(EntityType.BlockheadSourceEndpoint_Timestamp, blockheadSourceEndpointTimestamp[EntityMetaKey.Selector], {
											sources: [
												Source.Local_Internal,
											],
										})
									}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest health available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<BlockheadSourceView
						selection={select(EntityType.BlockheadSource, selection.entitySelector.$source)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Endpoint URL</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpoint}
					>
						{#snippet children(entity)}
							<a
								href={entity.endpointUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.endpointUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Binding ID</dt>
				<dd>
					{selection.entitySelector.bindingId}
				</dd>
			</div>

			<div>
				<dt>Endpoint index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.endpointIndex}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Target kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									targetKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.targetKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Target</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpoint}
					>
						{#snippet children(entity)}
							{entity.targetKey}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Wire protocol</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpoint}
					>
						{#snippet children(entity)}
							{entity.wireProtocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>API family</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceEndpoint}
					>
						{#snippet children(entity)}
							{entity.apiFamily}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Delivery</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									delivery: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.delivery}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							corsEnabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const corsEnabled = entity.corsEnabled}
					{#if corsEnabled != null}
						<div>
							<dt>Browser CORS</dt>
							<dd>
								{corsEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadSourceEndpoint_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Health history'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
