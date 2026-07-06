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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalNostrNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalNostrNetwork_Timestamp>>
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
	const globalNostrNetworkTimestamp = $derived(selection({
		fields: {
			reachable: true,
			sourceWindowNoteCount: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global Nostr network timestamp')
	const viewDomId = $derived('-global-nostr-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalNostrNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalNostrNetworkTimestamp}>
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
		<ResourceBoundary resource={globalNostrNetworkTimestamp}>
			{#snippet Pending()}
				{[String((selection.entitySelector.source ?? prefetched.source) ?? ''), String((prefetched.reachable) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global Nostr network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? ''), String((resolvedEntity.reachable) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalNostrNetworkTimestamp}>
			{#snippet Pending()}
				{@const sourceWindowNoteCount0 = prefetched.sourceWindowNoteCount}
				{#if sourceWindowNoteCount0 !== undefined && sourceWindowNoteCount0 !== null}
					<span data-text="muted">
						{String((sourceWindowNoteCount0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sourceWindowNoteCount0 = resolvedEntity.sourceWindowNoteCount}
				{#if sourceWindowNoteCount0 !== undefined && sourceWindowNoteCount0 !== null}
					<span data-text="muted">
						{String((sourceWindowNoteCount0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							filterKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const filterKind = prefetched.filterKind}
					{#if filterKind !== undefined && filterKind !== null}
						<div>
							<dt>Filter kind</dt>
							<dd>
								{String((filterKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const filterKind = resolvedEntity.filterKind}
					{#if filterKind !== undefined && filterKind !== null}
						<div>
							<dt>Filter kind</dt>
							<dd>
								{String((filterKind) ?? '')}
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
							configuredRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const configuredRelayCount = prefetched.configuredRelayCount}
					{#if configuredRelayCount !== undefined && configuredRelayCount !== null}
						<div>
							<dt>Configured relay count</dt>
							<dd>
								{String((configuredRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const configuredRelayCount = resolvedEntity.configuredRelayCount}
					{#if configuredRelayCount !== undefined && configuredRelayCount !== null}
						<div>
							<dt>Configured relay count</dt>
							<dd>
								{String((configuredRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachableRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachableRelayCount = prefetched.reachableRelayCount}
					{#if reachableRelayCount !== undefined && reachableRelayCount !== null}
						<div>
							<dt>Reachable relay count</dt>
							<dd>
								{String((reachableRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachableRelayCount = resolvedEntity.reachableRelayCount}
					{#if reachableRelayCount !== undefined && reachableRelayCount !== null}
						<div>
							<dt>Reachable relay count</dt>
							<dd>
								{String((reachableRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogRelayCount = prefetched.localCatalogRelayCount}
					{#if localCatalogRelayCount !== undefined && localCatalogRelayCount !== null}
						<div>
							<dt>Local catalog relay count</dt>
							<dd>
								{String((localCatalogRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogRelayCount = resolvedEntity.localCatalogRelayCount}
					{#if localCatalogRelayCount !== undefined && localCatalogRelayCount !== null}
						<div>
							<dt>Local catalog relay count</dt>
							<dd>
								{String((localCatalogRelayCount) ?? '')}
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
							sourceWindowProfileCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowProfileCount = prefetched.sourceWindowProfileCount}
					{#if sourceWindowProfileCount !== undefined && sourceWindowProfileCount !== null}
						<div>
							<dt>Source window profile count</dt>
							<dd>
								{String((sourceWindowProfileCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowProfileCount = resolvedEntity.sourceWindowProfileCount}
					{#if sourceWindowProfileCount !== undefined && sourceWindowProfileCount !== null}
						<div>
							<dt>Source window profile count</dt>
							<dd>
								{String((sourceWindowProfileCount) ?? '')}
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
							<dt>Source window note count</dt>
							<dd>
								{String((sourceWindowNoteCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowNoteCount = resolvedEntity.sourceWindowNoteCount}
					{#if sourceWindowNoteCount !== undefined && sourceWindowNoteCount !== null}
						<div>
							<dt>Source window note count</dt>
							<dd>
								{String((sourceWindowNoteCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowRelayCount = prefetched.sourceWindowRelayCount}
					{#if sourceWindowRelayCount !== undefined && sourceWindowRelayCount !== null}
						<div>
							<dt>Source window relay count</dt>
							<dd>
								{String((sourceWindowRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowRelayCount = resolvedEntity.sourceWindowRelayCount}
					{#if sourceWindowRelayCount !== undefined && sourceWindowRelayCount !== null}
						<div>
							<dt>Source window relay count</dt>
							<dd>
								{String((sourceWindowRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowRepostCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowRepostCount = prefetched.sourceWindowRepostCount}
					{#if sourceWindowRepostCount !== undefined && sourceWindowRepostCount !== null}
						<div>
							<dt>Source window repost count</dt>
							<dd>
								{String((sourceWindowRepostCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowRepostCount = resolvedEntity.sourceWindowRepostCount}
					{#if sourceWindowRepostCount !== undefined && sourceWindowRepostCount !== null}
						<div>
							<dt>Source window repost count</dt>
							<dd>
								{String((sourceWindowRepostCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowArticleCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowArticleCount = prefetched.sourceWindowArticleCount}
					{#if sourceWindowArticleCount !== undefined && sourceWindowArticleCount !== null}
						<div>
							<dt>Source window article count</dt>
							<dd>
								{String((sourceWindowArticleCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowArticleCount = resolvedEntity.sourceWindowArticleCount}
					{#if sourceWindowArticleCount !== undefined && sourceWindowArticleCount !== null}
						<div>
							<dt>Source window article count</dt>
							<dd>
								{String((sourceWindowArticleCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalNostrNetworkView
						selection={select(EntityType._GlobalNostrNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
