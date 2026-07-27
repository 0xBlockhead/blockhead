<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.A2aAgentCard_Snapshot> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [],
	}))
	const a2aAgentCardSnapshot = $derived(viewSelection({
		fields: {
			name: true,
			version: true,
			protocolVersion: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.name ?? '') || String(pendingEntity.contentHash ?? '') || 'A2A agent card snapshot')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={a2aAgentCardSnapshot}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={a2aAgentCardSnapshot}>
			{#snippet children(entity)}
				{(entity.version ?? '') || (entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={a2aAgentCardSnapshot}>
			{#snippet children(entity)}
				{@const protocolVersion0 = entity.protocolVersion}
				{#if protocolVersion0 != null}
					<span data-text="muted">
						{protocolVersion0}
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
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>content hash algorithm</dt>
				<dd>
					<TruncatedValue value={pendingEntity.contentHashAlgorithm} />
				</dd>
			</div>

			<div>
				<dt>content hash</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.contentHash)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fetchedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fetchedAt = entity.fetchedAt}
					{#if fetchedAt != null}
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
					viewSelection({
						fields: {
							snapshotKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const snapshotKind = entity.snapshotKind}
					{#if snapshotKind != null}
						<div>
							<dt>snapshot kind</dt>
							<dd>
								{snapshotKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={a2aAgentCardSnapshot}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aAgentCardSnapshot}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={a2aAgentCardSnapshot}
			>
				{#snippet children(entity)}
					{@const protocolVersion = entity.protocolVersion}
					{#if protocolVersion != null}
						<div>
							<dt>protocol version</dt>
							<dd>
								{protocolVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerName = entity.providerName}
					{#if providerName != null}
						<div>
							<dt>provider name</dt>
							<dd>
								{providerName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerUrl = entity.providerUrl}
					{#if providerUrl != null}
						<div>
							<dt>provider URL</dt>
							<dd>
								<a
									href={String(providerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(providerUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							preferredTransport: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const preferredTransport = entity.preferredTransport}
					{#if preferredTransport != null}
						<div>
							<dt>preferred transport</dt>
							<dd>
								{preferredTransport}
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
						id='interfaces'
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
						id='services'
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
						id='skills'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
