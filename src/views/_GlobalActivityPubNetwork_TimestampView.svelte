<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalActivityPubNetwork_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Mastodon_Rest,
		],
	}))
	const globalActivityPubNetworkTimestamp = $derived(viewSelection({
		fields: {
			instanceTitle: true,
			instanceOrigin: true,
			reachable: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.instanceTitle ?? ''), String(pendingEntity.timestampMs ?? '')].filter(Boolean).join(' ') || 'global ActivityPub network timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalActivityPubNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalActivityPubNetworkTimestamp}>
			{#snippet children(entity)}
				{[(entity.instanceTitle ?? ''), String(pendingEntity.timestampMs)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalActivityPubNetworkTimestamp}>
			{#snippet children(entity)}
				{[String(entity.instanceOrigin ?? ''), pendingEntity.source].filter(Boolean).join(' ') || [(entity.instanceTitle ?? ''), String(pendingEntity.timestampMs)].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalActivityPubNetworkTimestamp}>
			{#snippet children(entity)}
				{@const reachable0 = entity.reachable}
				{#if reachable0 != null}
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
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={globalActivityPubNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const instanceOrigin = entity.instanceOrigin}
					{#if instanceOrigin != null}
						<div>
							<dt>Instance origin</dt>
							<dd>
								<a
									href={String(instanceOrigin)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(instanceOrigin)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={globalActivityPubNetworkTimestamp}
			>
				{#snippet children(entity)}
					{@const instanceTitle = entity.instanceTitle}
					{#if instanceTitle != null}
						<div>
							<dt>Instance title</dt>
							<dd>
								{instanceTitle}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							instanceDescription: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const instanceDescription = entity.instanceDescription}
					{#if instanceDescription != null}
						<div>
							<dt>Instance description</dt>
							<dd>
								{instanceDescription}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							instanceVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const instanceVersion = entity.instanceVersion}
					{#if instanceVersion != null}
						<div>
							<dt>Instance version</dt>
							<dd>
								{instanceVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={globalActivityPubNetworkTimestamp}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							activeUserCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeUserCount = entity.activeUserCount}
					{#if activeUserCount != null}
						<div>
							<dt>Active users</dt>
							<dd>
								<NumberValue
									value={activeUserCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedActorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedActorCount = entity.observedActorCount}
					{#if observedActorCount != null}
						<div>
							<dt>Observed actors</dt>
							<dd>
								<NumberValue
									value={observedActorCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							observedNoteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedNoteCount = entity.observedNoteCount}
					{#if observedNoteCount != null}
						<div>
							<dt>Observed notes</dt>
							<dd>
								<NumberValue
									value={observedNoteCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							seededInstanceCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const seededInstanceCount = entity.seededInstanceCount}
					{#if seededInstanceCount != null}
						<div>
							<dt>Seeded instances</dt>
							<dd>
								<NumberValue
									value={seededInstanceCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							knownPeerDomainCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const knownPeerDomainCount = entity.knownPeerDomainCount}
					{#if knownPeerDomainCount != null}
						<div>
							<dt>Known peer domains</dt>
							<dd>
								<NumberValue
									value={knownPeerDomainCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							moderatedDomainCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moderatedDomainCount = entity.moderatedDomainCount}
					{#if moderatedDomainCount != null}
						<div>
							<dt>Moderated domains</dt>
							<dd>
								<NumberValue
									value={moderatedDomainCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
