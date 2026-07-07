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
			observedNoteCount: true,
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
				{@const observedNoteCount0 = prefetched.observedNoteCount}
				{#if observedNoteCount0 !== undefined && observedNoteCount0 !== null}
					<span data-text="muted">
						{String((observedNoteCount0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const observedNoteCount0 = resolvedEntity.observedNoteCount}
				{#if observedNoteCount0 !== undefined && observedNoteCount0 !== null}
					<span data-text="muted">
						{String((observedNoteCount0) ?? '')}
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
							declaredRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const declaredRelayCount = prefetched.declaredRelayCount}
					{#if declaredRelayCount !== undefined && declaredRelayCount !== null}
						<div>
							<dt>Declared relay count</dt>
							<dd>
								{String((declaredRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredRelayCount = resolvedEntity.declaredRelayCount}
					{#if declaredRelayCount !== undefined && declaredRelayCount !== null}
						<div>
							<dt>Declared relay count</dt>
							<dd>
								{String((declaredRelayCount) ?? '')}
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
							seededRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededRelayCount = prefetched.seededRelayCount}
					{#if seededRelayCount !== undefined && seededRelayCount !== null}
						<div>
							<dt>Seeded relay count</dt>
							<dd>
								{String((seededRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededRelayCount = resolvedEntity.seededRelayCount}
					{#if seededRelayCount !== undefined && seededRelayCount !== null}
						<div>
							<dt>Seeded relay count</dt>
							<dd>
								{String((seededRelayCount) ?? '')}
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
							observedProfileCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedProfileCount = prefetched.observedProfileCount}
					{#if observedProfileCount !== undefined && observedProfileCount !== null}
						<div>
							<dt>Observed profile count</dt>
							<dd>
								{String((observedProfileCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedProfileCount = resolvedEntity.observedProfileCount}
					{#if observedProfileCount !== undefined && observedProfileCount !== null}
						<div>
							<dt>Observed profile count</dt>
							<dd>
								{String((observedProfileCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedNoteCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedNoteCount = prefetched.observedNoteCount}
					{#if observedNoteCount !== undefined && observedNoteCount !== null}
						<div>
							<dt>Observed note count</dt>
							<dd>
								{String((observedNoteCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedNoteCount = resolvedEntity.observedNoteCount}
					{#if observedNoteCount !== undefined && observedNoteCount !== null}
						<div>
							<dt>Observed note count</dt>
							<dd>
								{String((observedNoteCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedRelayCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedRelayCount = prefetched.observedRelayCount}
					{#if observedRelayCount !== undefined && observedRelayCount !== null}
						<div>
							<dt>Observed relay count</dt>
							<dd>
								{String((observedRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedRelayCount = resolvedEntity.observedRelayCount}
					{#if observedRelayCount !== undefined && observedRelayCount !== null}
						<div>
							<dt>Observed relay count</dt>
							<dd>
								{String((observedRelayCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedRepostCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedRepostCount = prefetched.observedRepostCount}
					{#if observedRepostCount !== undefined && observedRepostCount !== null}
						<div>
							<dt>Observed repost count</dt>
							<dd>
								{String((observedRepostCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedRepostCount = resolvedEntity.observedRepostCount}
					{#if observedRepostCount !== undefined && observedRepostCount !== null}
						<div>
							<dt>Observed repost count</dt>
							<dd>
								{String((observedRepostCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedArticleCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedArticleCount = prefetched.observedArticleCount}
					{#if observedArticleCount !== undefined && observedArticleCount !== null}
						<div>
							<dt>Observed article count</dt>
							<dd>
								{String((observedArticleCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedArticleCount = resolvedEntity.observedArticleCount}
					{#if observedArticleCount !== undefined && observedArticleCount !== null}
						<div>
							<dt>Observed article count</dt>
							<dd>
								{String((observedArticleCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Hub</dt>
				<dd>
					<GlobalNostrNetworkView
						selection={select(EntityType._GlobalNostrNetwork, selection.entitySelector.$hub, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
