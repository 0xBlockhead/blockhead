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
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalActivityPubNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalActivityPubNetwork_Timestamp>>
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
	const globalActivityPubNetworkTimestamp = $derived(selection({
		sources: [
			Source.Fedi_Rest,
			Source.Mastodon_Rest,
		],
		fields: {
			instanceTitle: true,
			instanceOrigin: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.instanceTitle) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global ActivityPub network timestamp')
	const viewDomId = $derived('-global-activity-pub-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalActivityPubNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.instanceTitle) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global ActivityPub network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.instanceTitle) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalActivityPubNetworkTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.instanceOrigin) ?? ''), String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((prefetched.instanceTitle) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global ActivityPub network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.instanceOrigin) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.instanceTitle) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalActivityPubNetworkTimestamp}>
			{#snippet Pending()}
				{@const reachable0 = prefetched.reachable}
				{#if reachable0 !== undefined && reachable0 !== null}
					<span data-text="muted">
						{reachable0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const reachable0 = resolvedEntity.reachable}
				{#if reachable0 !== undefined && reachable0 !== null}
					<span data-text="muted">
						{reachable0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalActivityPubNetworkView
						selection={select(EntityType._GlobalActivityPubNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Title}
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
							instanceOrigin: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const instanceOrigin = prefetched.instanceOrigin}
					{#if instanceOrigin !== undefined && instanceOrigin !== null}
						<div>
							<dt>Instance origin</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(instanceOrigin)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(instanceOrigin)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instanceOrigin = resolvedEntity.instanceOrigin}
					{#if instanceOrigin !== undefined && instanceOrigin !== null}
						<div>
							<dt>Instance origin</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(instanceOrigin)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(instanceOrigin)} />
								</svelte:element>
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
							instanceTitle: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const instanceTitle = prefetched.instanceTitle}
					{#if instanceTitle !== undefined && instanceTitle !== null}
						<div>
							<dt>Instance title</dt>
							<dd>
								{String((instanceTitle) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instanceTitle = resolvedEntity.instanceTitle}
					{#if instanceTitle !== undefined && instanceTitle !== null}
						<div>
							<dt>Instance title</dt>
							<dd>
								{String((instanceTitle) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							instanceDescription: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const instanceDescription = prefetched.instanceDescription}
					{#if instanceDescription !== undefined && instanceDescription !== null}
						<div>
							<dt>Instance description</dt>
							<dd>
								{String((instanceDescription) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instanceDescription = resolvedEntity.instanceDescription}
					{#if instanceDescription !== undefined && instanceDescription !== null}
						<div>
							<dt>Instance description</dt>
							<dd>
								{String((instanceDescription) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							instanceVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const instanceVersion = prefetched.instanceVersion}
					{#if instanceVersion !== undefined && instanceVersion !== null}
						<div>
							<dt>Instance version</dt>
							<dd>
								{String((instanceVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const instanceVersion = resolvedEntity.instanceVersion}
					{#if instanceVersion !== undefined && instanceVersion !== null}
						<div>
							<dt>Instance version</dt>
							<dd>
								{String((instanceVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
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
							activeUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const activeUserCount = prefetched.activeUserCount}
					{#if activeUserCount !== undefined && activeUserCount !== null}
						<div>
							<dt>Active users</dt>
							<dd>
								<NumberValue value={Number(activeUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeUserCount = resolvedEntity.activeUserCount}
					{#if activeUserCount !== undefined && activeUserCount !== null}
						<div>
							<dt>Active users</dt>
							<dd>
								<NumberValue value={Number(activeUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowActorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowActorCount = prefetched.sourceWindowActorCount}
					{#if sourceWindowActorCount !== undefined && sourceWindowActorCount !== null}
						<div>
							<dt>Source-window actors</dt>
							<dd>
								<NumberValue value={Number(sourceWindowActorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowActorCount = resolvedEntity.sourceWindowActorCount}
					{#if sourceWindowActorCount !== undefined && sourceWindowActorCount !== null}
						<div>
							<dt>Source-window actors</dt>
							<dd>
								<NumberValue value={Number(sourceWindowActorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowNoteCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowNoteCount = prefetched.sourceWindowNoteCount}
					{#if sourceWindowNoteCount !== undefined && sourceWindowNoteCount !== null}
						<div>
							<dt>Source-window notes</dt>
							<dd>
								<NumberValue value={Number(sourceWindowNoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowNoteCount = resolvedEntity.sourceWindowNoteCount}
					{#if sourceWindowNoteCount !== undefined && sourceWindowNoteCount !== null}
						<div>
							<dt>Source-window notes</dt>
							<dd>
								<NumberValue value={Number(sourceWindowNoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogInstanceCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogInstanceCount = prefetched.localCatalogInstanceCount}
					{#if localCatalogInstanceCount !== undefined && localCatalogInstanceCount !== null}
						<div>
							<dt>Local catalog instances</dt>
							<dd>
								<NumberValue value={Number(localCatalogInstanceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogInstanceCount = resolvedEntity.localCatalogInstanceCount}
					{#if localCatalogInstanceCount !== undefined && localCatalogInstanceCount !== null}
						<div>
							<dt>Local catalog instances</dt>
							<dd>
								<NumberValue value={Number(localCatalogInstanceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
