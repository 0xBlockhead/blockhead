<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BnbBeaconNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BnbBeaconNetwork_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const bnbBeaconNetworkTimestamp = $derived(selection({
		fields: {
			latestArchivedHeight: true,
			archiveCoverageStatus: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'bnb beacon network timestamp')
	const viewDomId = $derived('bnb-beacon-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbBeaconNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.latestArchivedHeight) ?? ''), String((prefetched.archiveCoverageStatus) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'bnb beacon network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.latestArchivedHeight) ?? ''), String((resolvedEntity.archiveCoverageStatus) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bnbBeaconNetworkTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							archiveCoverageStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const archiveCoverageStatus = prefetched.archiveCoverageStatus}
					{#if archiveCoverageStatus !== undefined && archiveCoverageStatus !== null}
						<div>
							<dt>archive coverage status</dt>
							<dd>
								{String((archiveCoverageStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const archiveCoverageStatus = resolvedEntity.archiveCoverageStatus}
					{#if archiveCoverageStatus !== undefined && archiveCoverageStatus !== null}
						<div>
							<dt>archive coverage status</dt>
							<dd>
								{String((archiveCoverageStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestArchivedHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestArchivedHeight = prefetched.latestArchivedHeight}
					{#if latestArchivedHeight !== undefined && latestArchivedHeight !== null}
						<div>
							<dt>latest archived height</dt>
							<dd>
								<NumberValue value={Number(latestArchivedHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestArchivedHeight = resolvedEntity.latestArchivedHeight}
					{#if latestArchivedHeight !== undefined && latestArchivedHeight !== null}
						<div>
							<dt>latest archived height</dt>
							<dd>
								<NumberValue value={Number(latestArchivedHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latestArchivedBlockTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestArchivedBlockTimeMs = prefetched.latestArchivedBlockTimeMs}
					{#if latestArchivedBlockTimeMs !== undefined && latestArchivedBlockTimeMs !== null}
						<div>
							<dt>latest archived block time ms</dt>
							<dd>
								<Timestamp timestamp={Number(latestArchivedBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestArchivedBlockTimeMs = resolvedEntity.latestArchivedBlockTimeMs}
					{#if latestArchivedBlockTimeMs !== undefined && latestArchivedBlockTimeMs !== null}
						<div>
							<dt>latest archived block time ms</dt>
							<dd>
								<Timestamp timestamp={Number(latestArchivedBlockTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							validatorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validatorCount = prefetched.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>validator count</dt>
							<dd>
								<NumberValue value={Number(validatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validatorCount = resolvedEntity.validatorCount}
					{#if validatorCount !== undefined && validatorCount !== null}
						<div>
							<dt>validator count</dt>
							<dd>
								<NumberValue value={Number(validatorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenCount = prefetched.tokenCount}
					{#if tokenCount !== undefined && tokenCount !== null}
						<div>
							<dt>token count</dt>
							<dd>
								<NumberValue value={Number(tokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenCount = resolvedEntity.tokenCount}
					{#if tokenCount !== undefined && tokenCount !== null}
						<div>
							<dt>token count</dt>
							<dd>
								<NumberValue value={Number(tokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							migrationRecordCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const migrationRecordCount = prefetched.migrationRecordCount}
					{#if migrationRecordCount !== undefined && migrationRecordCount !== null}
						<div>
							<dt>migration record count</dt>
							<dd>
								<NumberValue value={Number(migrationRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const migrationRecordCount = resolvedEntity.migrationRecordCount}
					{#if migrationRecordCount !== undefined && migrationRecordCount !== null}
						<div>
							<dt>migration record count</dt>
							<dd>
								<NumberValue value={Number(migrationRecordCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
