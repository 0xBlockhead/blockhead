<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType._GlobalNostrNetwork_Timestamp>, 'prefetched'> = $props()

	const globalNostrNetworkTimestamp = $derived(selection({
		fields: {
			reachable: true,
			observedNoteCount: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalNostrNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalNostrNetworkTimestamp}>
			{#snippet children(entity)}
				{[selection.entitySelector.source, String(entity.reachable ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalNostrNetworkTimestamp}>
			{#snippet children(entity)}
				{@const observedNoteCount = entity.observedNoteCount}
				{#if observedNoteCount != null}
					<span data-text="muted">
						{observedNoteCount}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={globalNostrNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
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
				{#snippet children(entity)}
					{@const filterKind = entity.filterKind}
					{#if filterKind != null}
						<div>
							<dt>Filter kind</dt>
							<dd>
								{filterKind}
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
				{#snippet children(entity)}
					{@const declaredRelayCount = entity.declaredRelayCount}
					{#if declaredRelayCount != null}
						<div>
							<dt>Declared relay count</dt>
							<dd>
								{declaredRelayCount}
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
				{#snippet children(entity)}
					{@const reachableRelayCount = entity.reachableRelayCount}
					{#if reachableRelayCount != null}
						<div>
							<dt>Reachable relay count</dt>
							<dd>
								{reachableRelayCount}
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
				{#snippet children(entity)}
					{@const seededRelayCount = entity.seededRelayCount}
					{#if seededRelayCount != null}
						<div>
							<dt>Seeded relay count</dt>
							<dd>
								{seededRelayCount}
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
				{#snippet children(entity)}
					{@const observedProfileCount = entity.observedProfileCount}
					{#if observedProfileCount != null}
						<div>
							<dt>Observed profile count</dt>
							<dd>
								{observedProfileCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={globalNostrNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const observedNoteCount = entity.observedNoteCount}
					{#if observedNoteCount != null}
						<div>
							<dt>Observed note count</dt>
							<dd>
								{observedNoteCount}
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
				{#snippet children(entity)}
					{@const observedRelayCount = entity.observedRelayCount}
					{#if observedRelayCount != null}
						<div>
							<dt>Observed relay count</dt>
							<dd>
								{observedRelayCount}
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
				{#snippet children(entity)}
					{@const observedRepostCount = entity.observedRepostCount}
					{#if observedRepostCount != null}
						<div>
							<dt>Observed repost count</dt>
							<dd>
								{observedRepostCount}
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
				{#snippet children(entity)}
					{@const observedArticleCount = entity.observedArticleCount}
					{#if observedArticleCount != null}
						<div>
							<dt>Observed article count</dt>
							<dd>
								{observedArticleCount}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
