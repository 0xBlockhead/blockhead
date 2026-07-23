<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.A2aAgentCard_Snapshot>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.A2aAgentCard_Snapshot>
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
	const a2aAgentCardSnapshot = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			name: true,
			version: true,
			protocolVersion: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			name: true,
			version: true,
			protocolVersion: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.contentHash) ?? '')].filter(Boolean).join(' ') || 'A2A agent card snapshot')
	const viewDomId = $derived('a2a-agent-card-snapshot-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import A2aAgentInterfacesView from '$/views/A2aAgentInterfacesView.svelte'
	import A2aAgentServicesView from '$/views/A2aAgentServicesView.svelte'
	import A2aAgentSkillsView from '$/views/A2aAgentSkillsView.svelte'
	import A2aAgentCardView from '$/views/A2aAgentCardView.svelte'
</script>


<EntityView
	entityType={EntityType.A2aAgentCard_Snapshot}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name') && Object.hasOwn(prefetched, 'version') && Object.hasOwn(prefetched, 'protocolVersion')}
			{[String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={a2aAgentCardSnapshot}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name') && Object.hasOwn(prefetched, 'version') && Object.hasOwn(prefetched, 'protocolVersion')}
			{[String((pendingEntity.version) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={a2aAgentCardSnapshot}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'name') && Object.hasOwn(prefetched, 'version') && Object.hasOwn(prefetched, 'protocolVersion')}
			{@const protocolVersion0 = pendingEntity.protocolVersion}
			{#if protocolVersion0 !== undefined && protocolVersion0 !== null}
				<span data-text="muted">
					{String((protocolVersion0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={a2aAgentCardSnapshot}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolVersion0 = resolvedEntity.protocolVersion}
					{#if protocolVersion0 !== undefined && protocolVersion0 !== null}
						<span data-text="muted">
							{String((protocolVersion0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>card</dt>
				<dd>
					<A2aAgentCardView
						selection={select(EntityType.A2aAgentCard, selection.entitySelector.$card)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>content hash algorithm</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									contentHashAlgorithm: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contentHashAlgorithm = resolvedEntity.contentHashAlgorithm}
							{#if contentHashAlgorithm !== undefined && contentHashAlgorithm !== null}
								<TruncatedValue value={String((contentHashAlgorithm) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>content hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									contentHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const contentHash = resolvedEntity.contentHash}
							{#if contentHash !== undefined && contentHash !== null}
								<TruncatedValue value={String((contentHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fetchedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fetchedAt = resolvedEntity.fetchedAt}
					{#if fetchedAt !== undefined && fetchedAt !== null}
						<div>
							<dt>fetched AT</dt>
							<dd>
								<Timestamp timestamp={Number(fetchedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							snapshotKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const snapshotKind = resolvedEntity.snapshotKind}
					{#if snapshotKind !== undefined && snapshotKind !== null}
						<div>
							<dt>snapshot kind</dt>
							<dd>
								{String((snapshotKind) ?? '')}
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
						sources: selection.sources,
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolVersion = resolvedEntity.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{String((protocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerName = resolvedEntity.providerName}
					{#if providerName !== undefined && providerName !== null}
						<div>
							<dt>provider name</dt>
							<dd>
								{String((providerName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerUrl = resolvedEntity.providerUrl}
					{#if providerUrl !== undefined && providerUrl !== null}
						<div>
							<dt>provider URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(providerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(providerUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							preferredTransport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const preferredTransport = resolvedEntity.preferredTransport}
					{#if preferredTransport !== undefined && preferredTransport !== null}
						<div>
							<dt>preferred transport</dt>
							<dd>
								{String((preferredTransport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const a2aAgentCardSnapshotA2aAgentInterfacesViewInterfacesResource = selection.$$interfaces}
		<ResourceBoundary
			resource={a2aAgentCardSnapshotA2aAgentInterfacesViewInterfacesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<A2aAgentInterfacesView
					selection={a2aAgentCardSnapshotA2aAgentInterfacesViewInterfacesResource}
					countResource={a2aAgentCardSnapshotA2aAgentInterfacesViewInterfacesResource.count}
					title='interfaces'
					id='A2aAgentInterfacesView-interfaces'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const a2aAgentCardSnapshotA2aAgentServicesViewServicesResource = selection.$$services}
		<ResourceBoundary
			resource={a2aAgentCardSnapshotA2aAgentServicesViewServicesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<A2aAgentServicesView
					selection={a2aAgentCardSnapshotA2aAgentServicesViewServicesResource}
					countResource={a2aAgentCardSnapshotA2aAgentServicesViewServicesResource.count}
					title='services'
					id='A2aAgentServicesView-services'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const a2aAgentCardSnapshotA2aAgentSkillsViewSkillsResource = selection.$$skills}
		<ResourceBoundary
			resource={a2aAgentCardSnapshotA2aAgentSkillsViewSkillsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<A2aAgentSkillsView
					selection={a2aAgentCardSnapshotA2aAgentSkillsViewSkillsResource}
					countResource={a2aAgentCardSnapshotA2aAgentSkillsViewSkillsResource.count}
					title='skills'
					id='A2aAgentSkillsView-skills'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
