<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.SnapshotSpace> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SnapshotHub_Graphql,
		],
	}))
	const snapshotSpace = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
			proposalsCount: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.spaceId || 'Snapshot space')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SnapshotProposalsView from '$/views/SnapshotProposalsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SnapshotSpace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/snapshot/space/[spaceId=stringSegment]',
				{
					spaceId: encodeURIComponent(selection.entitySelector.spaceId),
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
		<ResourceBoundary resource={snapshotSpace}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={snapshotSpace}>
			{#snippet children(entity)}
				{[(entity.symbol ?? ''), String(entity.proposalsCount ?? '')].filter(Boolean).join(' ') || (entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				{#if network != null}
					{@const networkInitial = untrack(() => network)}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
							prefetched={network ?? networkInitial}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Space ID</dt>
				<dd>
					{selection.entitySelector.spaceId}
				</dd>
			</div>

			<ResourceBoundary
				resource={snapshotSpace}
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
				resource={snapshotSpace}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={snapshotSpace}
			>
				{#snippet children(entity)}
					{@const proposalsCount = entity.proposalsCount}
					{#if proposalsCount != null}
						<div>
							<dt>Proposals</dt>
							<dd>
								{proposalsCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							votesCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votesCount = entity.votesCount}
					{#if votesCount != null}
						<div>
							<dt>Votes</dt>
							<dd>
								{votesCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							followersCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followersCount = entity.followersCount}
					{#if followersCount != null}
						<div>
							<dt>Followers</dt>
							<dd>
								{followersCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							createdAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAtMs = entity.createdAtMs}
					{#if createdAtMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								{createdAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								about: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const about = entity.about}
						{#if about != null}
							<div>
								<dt>About</dt>
								<dd>
									<span data-text="long-text">{about}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const proposalsResource = selection.$$proposals}
		<ResourceBoundary
			resource={proposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SnapshotProposalsView
						selection={proposalsResource}
						countResource={proposalsResource.count}
						title='Proposals'
						href={
							resolve(
								'/~/snapshot/space/[spaceId=stringSegment]/(snapshotSpace)/proposals',
								{
									spaceId: encodeURIComponent(selection.entitySelector.spaceId),
								}
							)
						}
						id='proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
