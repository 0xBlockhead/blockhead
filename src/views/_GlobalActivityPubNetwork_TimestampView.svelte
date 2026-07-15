<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType._GlobalActivityPubNetwork_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalActivityPubNetwork_Timestamp>>
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
			Source.Mastodon_Rest,
		],
		fields: {
			instanceTitle: true,
			instanceOrigin: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.instanceTitle) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global ActivityPub network timestamp')
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
				{[String((pendingEntity.instanceTitle) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global ActivityPub network timestamp'}
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
				{[String((pendingEntity.instanceOrigin) ?? ''), String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.instanceTitle) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global ActivityPub network timestamp'}
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
				{@const reachable0 = pendingEntity.reachable}
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
						selection={select(EntityType._GlobalActivityPubNetwork, selection.entitySelector.$hub, {})}
						href={(selection.entitySelector.$hub.scope === '_GlobalActivityPubNetwork' ? resolve('/activitypub') : undefined)}
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
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
					{@const instanceOrigin = pendingEntity.instanceOrigin}
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
					{@const instanceTitle = pendingEntity.instanceTitle}
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
					{@const instanceDescription = pendingEntity.instanceDescription}
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
					{@const instanceVersion = pendingEntity.instanceVersion}
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
					{@const reachable = pendingEntity.reachable}
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
					{@const activeUserCount = pendingEntity.activeUserCount}
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
							observedActorCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedActorCount = pendingEntity.observedActorCount}
					{#if observedActorCount !== undefined && observedActorCount !== null}
						<div>
							<dt>Observed actors</dt>
							<dd>
								<NumberValue value={Number(observedActorCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedActorCount = resolvedEntity.observedActorCount}
					{#if observedActorCount !== undefined && observedActorCount !== null}
						<div>
							<dt>Observed actors</dt>
							<dd>
								<NumberValue value={Number(observedActorCount)} />
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
					{@const observedNoteCount = pendingEntity.observedNoteCount}
					{#if observedNoteCount !== undefined && observedNoteCount !== null}
						<div>
							<dt>Observed notes</dt>
							<dd>
								<NumberValue value={Number(observedNoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedNoteCount = resolvedEntity.observedNoteCount}
					{#if observedNoteCount !== undefined && observedNoteCount !== null}
						<div>
							<dt>Observed notes</dt>
							<dd>
								<NumberValue value={Number(observedNoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededInstanceCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededInstanceCount = pendingEntity.seededInstanceCount}
					{#if seededInstanceCount !== undefined && seededInstanceCount !== null}
						<div>
							<dt>Seeded instances</dt>
							<dd>
								<NumberValue value={Number(seededInstanceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededInstanceCount = resolvedEntity.seededInstanceCount}
					{#if seededInstanceCount !== undefined && seededInstanceCount !== null}
						<div>
							<dt>Seeded instances</dt>
							<dd>
								<NumberValue value={Number(seededInstanceCount)} />
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
							knownPeerDomainCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const knownPeerDomainCount = pendingEntity.knownPeerDomainCount}
					{#if knownPeerDomainCount !== undefined && knownPeerDomainCount !== null}
						<div>
							<dt>Known peer domains</dt>
							<dd>
								<NumberValue value={Number(knownPeerDomainCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const knownPeerDomainCount = resolvedEntity.knownPeerDomainCount}
					{#if knownPeerDomainCount !== undefined && knownPeerDomainCount !== null}
						<div>
							<dt>Known peer domains</dt>
							<dd>
								<NumberValue value={Number(knownPeerDomainCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moderatedDomainCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moderatedDomainCount = pendingEntity.moderatedDomainCount}
					{#if moderatedDomainCount !== undefined && moderatedDomainCount !== null}
						<div>
							<dt>Moderated domains</dt>
							<dd>
								<NumberValue value={Number(moderatedDomainCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moderatedDomainCount = resolvedEntity.moderatedDomainCount}
					{#if moderatedDomainCount !== undefined && moderatedDomainCount !== null}
						<div>
							<dt>Moderated domains</dt>
							<dd>
								<NumberValue value={Number(moderatedDomainCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
