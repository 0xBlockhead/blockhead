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
	}: EntitySelectionViewProps<EntityType.BlockheadSource> = $props()

	const blockheadSourceLatestResource1 = $derived(
		selection
			.$$timestamps({
				sources: [
					Source.Local_Internal,
				],
				fields: {
					timestampMs: true,
					enabled: true,
					health: true,
					latencyMs: true,
					statusCode: true,
					error: true,
					rateLimitRemaining: true,
					rateLimitResetMs: true,
					resolverCount: true,
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
	const blockheadSource = $derived(viewSelection({
		fields: {
			label: true,
			source: true,
			provider: true,
			endpointUrl: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.id || 'source')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSourceEndpointsView from '$/views/BlockheadSourceEndpointsView.svelte'
	import BlockheadSource_TimestampsView from '$/views/BlockheadSource_TimestampsView.svelte'
	import BlockheadSource_TimestampView from '$/views/BlockheadSource_TimestampView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/manage/source/[sourceId=stringSegment]',
				{
					sourceId: selection.entitySelector.id,
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
		<ResourceBoundary resource={blockheadSource}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSource}>
			{#snippet children(entity)}
				{(entity.source ?? '') || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest health</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSourceLatestResource1}
					>
						{#snippet children(blockheadSourceTimestamps)}
							{@const blockheadSourceTimestamp = blockheadSourceTimestamps.values[0]}
							{#if blockheadSourceTimestamp != null}
								<BlockheadSource_TimestampView
									selection={
										select(EntityType.BlockheadSource_Timestamp, blockheadSourceTimestamp[EntityMetaKey.Selector], {
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
			<ResourceBoundary
				resource={blockheadSource}
			>
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadSource}
			>
				{#snippet children(entity)}
					{@const provider = entity.provider}
					{#if provider != null}
						<div>
							<dt>Provider</dt>
							<dd>
								{provider}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadSource}
			>
				{#snippet children(entity)}
					{@const endpointUrl = entity.endpointUrl}
					{#if endpointUrl != null}
						<div>
							<dt>Endpoint URL</dt>
							<dd>
								<a
									href={endpointUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={endpointUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transportKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transportKind = entity.transportKind}
					{#if transportKind != null}
						<div>
							<dt>Transport</dt>
							<dd>
								{transportKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							authKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authKind = entity.authKind}
					{#if authKind != null}
						<div>
							<dt>Auth</dt>
							<dd>
								{authKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							corsMode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const corsMode = entity.corsMode}
					{#if corsMode != null}
						<div>
							<dt>CORS</dt>
							<dd>
								{corsMode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							proxyMode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proxyMode = entity.proxyMode}
					{#if proxyMode != null}
						<div>
							<dt>Proxy</dt>
							<dd>
								{proxyMode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							environmentScope: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const environmentScope = entity.environmentScope}
					{#if environmentScope != null}
						<div>
							<dt>Environment</dt>
							<dd>
								{environmentScope}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const endpointsResource = selection
			.$$endpoints({
				sources: [
					Source.Constants_Internal,
				],
			})}
		<ResourceBoundary
			resource={endpointsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadSourceEndpointsView
						selection={endpointsResource}
						countResource={endpointsResource.count}
						title='Executable endpoints'
						id='endpoints'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadSource_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
