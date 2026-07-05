<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.A2aAgentCard_Snapshot>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.A2aAgentCard_Snapshot>>
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
	const a2aAgentCardSnapshot = $derived(selection({
		sources: [
			Source.A2aWellKnown_Http,
		],
		fields: {
			name: true,
			version: true,
			protocolVersion: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.name) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.contentHash ?? prefetched.contentHash) ?? '')].filter(Boolean).join(' ') || 'A2A agent card snapshot')
	const viewDomId = $derived('a2a-agent-card-snapshot-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
		<ResourceBoundary resource={a2aAgentCardSnapshot}>
			{#snippet Pending()}
				{[String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.contentHash ?? prefetched.contentHash) ?? '')].filter(Boolean).join(' ') || 'A2A agent card snapshot'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aAgentCardSnapshot}>
			{#snippet Pending()}
				{[String((prefetched.version) ?? '')].filter(Boolean).join(' ') || [String((prefetched.name) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.contentHash ?? prefetched.contentHash) ?? '')].filter(Boolean).join(' ') || 'A2A agent card snapshot'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.version) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aAgentCardSnapshot}>
			{#snippet Pending()}
				{@const protocolVersion0 = prefetched.protocolVersion}
				{#if protocolVersion0 !== undefined && protocolVersion0 !== null}
					<span data-text="muted">
						{String((protocolVersion0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>card</dt>
				<dd>
					<A2aAgentCardView
						selection={select(EntityType.A2aAgentCard, selection.entitySelector.$card)}
						layout={EntityLayout.Title}
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
								fields: {
									contentHashAlgorithm: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const contentHashAlgorithm = selection.entitySelector.contentHashAlgorithm ?? prefetched.contentHashAlgorithm}
							{#if contentHashAlgorithm !== undefined && contentHashAlgorithm !== null}
								<TruncatedValue value={String((contentHashAlgorithm) ?? '')} />
							{/if}
						{/snippet}

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
								fields: {
									contentHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const contentHash = selection.entitySelector.contentHash ?? prefetched.contentHash}
							{#if contentHash !== undefined && contentHash !== null}
								<TruncatedValue value={String((contentHash) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							fetchedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fetchedAt = prefetched.fetchedAt}
					{#if fetchedAt !== undefined && fetchedAt !== null}
						<div>
							<dt>fetched AT</dt>
							<dd>
								<Timestamp timestamp={Number(fetchedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							snapshotKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const snapshotKind = prefetched.snapshotKind}
					{#if snapshotKind !== undefined && snapshotKind !== null}
						<div>
							<dt>snapshot kind</dt>
							<dd>
								{String((snapshotKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = prefetched.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = prefetched.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = prefetched.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							protocolVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const protocolVersion = prefetched.protocolVersion}
					{#if protocolVersion !== undefined && protocolVersion !== null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{String((protocolVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerName = prefetched.providerName}
					{#if providerName !== undefined && providerName !== null}
						<div>
							<dt>provider name</dt>
							<dd>
								{String((providerName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerUrl = prefetched.providerUrl}
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
						fields: {
							preferredTransport: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const preferredTransport = prefetched.preferredTransport}
					{#if preferredTransport !== undefined && preferredTransport !== null}
						<div>
							<dt>preferred transport</dt>
							<dd>
								{String((preferredTransport) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<A2aAgentInterfacesView
				selection={selection[EntityProxyField]<EntityType.A2aAgentInterface>('$$interfaces')}
				title='interfaces'
				emptyText='No A2A agent interfaces.'
				id='A2aAgentInterfacesView-$$interfaces'
			/>

			<A2aAgentServicesView
				selection={selection[EntityProxyField]<EntityType.A2aAgentService>('$$services')}
				title='services'
				emptyText='No A2A agent services.'
				id='A2aAgentServicesView-$$services'
			/>

			<A2aAgentSkillsView
				selection={selection[EntityProxyField]<EntityType.A2aAgentSkill>('$$skills')}
				title='skills'
				emptyText='No A2A agent skills.'
				id='A2aAgentSkillsView-$$skills'
			/>
		{/if}
	{/snippet}
</EntityView>
