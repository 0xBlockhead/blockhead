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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NostrRelay_Timestamp> = $props()

	const nostrRelayTimestamp = $derived(selection({
		fields: {
			name: true,
			reachable: true,
			software: true,
		},
	}))
	const titleFallback = $derived([(prefetched.name ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || 'Nostr relay timestamp')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/relay/[relayKey=stringSegment]/(nostrRelay)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					relayKey: encodeURIComponent(selection.entitySelector.$relay.relayUrl),
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
		<ResourceBoundary resource={nostrRelayTimestamp}>
			{#snippet children(entity)}
				{[(entity.name ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrRelayTimestamp}>
			{#snippet children(entity)}
				{[String(entity.reachable ?? ''), (entity.software ?? '')].filter(Boolean).join(' ') || [(entity.name ?? ''), selection.entitySelector.source].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={selection.entitySelector.timestampMs} />
		</span>
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
				resource={nostrRelayTimestamp}
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
				resource={nostrRelayTimestamp}
			>
				{#snippet children(entity)}
					{@const software = entity.software}
					{#if software != null}
						<div>
							<dt>Software</dt>
							<dd>
								{software}
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
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd>
								{version}
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
							supportedNips: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supportedNips = entity.supportedNips}
					{#if supportedNips != null}
						<div>
							<dt>Supported NIPs</dt>
							<dd>
								{supportedNips.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isPaid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isPaid = entity.isPaid}
					{#if isPaid != null}
						<div>
							<dt>Paid relay</dt>
							<dd>
								{isPaid ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeUsers: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeUsers = entity.activeUsers}
					{#if activeUsers != null}
						<div>
							<dt>Active users</dt>
							<dd>
								{activeUsers}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							eventsPerDay: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const eventsPerDay = entity.eventsPerDay}
					{#if eventsPerDay != null}
						<div>
							<dt>Events per day</dt>
							<dd>
								{eventsPerDay}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rank: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rank = entity.rank}
					{#if rank != null}
						<div>
							<dt>Rank</dt>
							<dd>
								{rank}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nostrRelayTimestamp}
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
					selection({
						fields: {
							paymentsUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const paymentsUrl = entity.paymentsUrl}
					{#if paymentsUrl != null}
						<div>
							<dt>Payments URL</dt>
							<dd>
								<a
									href={paymentsUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={paymentsUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							termsOfServiceUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const termsOfServiceUrl = entity.termsOfServiceUrl}
					{#if termsOfServiceUrl != null}
						<div>
							<dt>Terms of service URL</dt>
							<dd>
								<a
									href={termsOfServiceUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={termsOfServiceUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							iconUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const iconUrl = entity.iconUrl}
					{#if iconUrl != null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<a
									href={iconUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={iconUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							bannerUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bannerUrl = entity.bannerUrl}
					{#if bannerUrl != null}
						<div>
							<dt>Banner URL</dt>
							<dd>
								<a
									href={bannerUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={bannerUrl} />
								</a>
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
							pubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pubkey = entity.pubkey}
					{#if pubkey != null}
						<div>
							<dt>Public key</dt>
							<dd>
								{pubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contact: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contact = entity.contact}
					{#if contact != null}
						<div>
							<dt>Contact</dt>
							<dd>
								{contact}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>Error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Relay</dt>
				<dd>
					<NostrRelayView
						selection={select(EntityType.NostrRelay, selection.entitySelector.$relay)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={
				selection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
