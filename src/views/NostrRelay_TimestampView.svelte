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
			selection: EntityProxyResource<typeof schema, EntityType.NostrRelay_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrRelay_Timestamp>>
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
	const nostrRelayTimestamp = $derived(selection({
		fields: {
			name: true,
			reachable: true,
			software: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.name) ?? ''), String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || 'Nostr relay timestamp')
	const viewDomId = $derived('nostr-relay-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRelay_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrRelayTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.name) ?? ''), String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || title || 'Nostr relay timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.name) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nostrRelayTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.reachable) ?? ''), String((pendingEntity.software) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.name) ?? ''), String((pendingEntity.source) ?? '')].filter(Boolean).join(' ') || title || 'Nostr relay timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.reachable) ?? ''), String((resolvedEntity.software) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.name) ?? ''), String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrRelayTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
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
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
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
							software: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const software = pendingEntity.software}
					{#if software !== undefined && software !== null}
						<div>
							<dt>Software</dt>
							<dd>
								{String((software) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const software = resolvedEntity.software}
					{#if software !== undefined && software !== null}
						<div>
							<dt>Software</dt>
							<dd>
								{String((software) ?? '')}
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
					{@const version = pendingEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>Version</dt>
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
							<dt>Version</dt>
							<dd>
								{String((version) ?? '')}
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
				{#snippet Pending()}
					{@const supportedNips = pendingEntity.supportedNips}
					{#if supportedNips !== undefined && supportedNips !== null}
						<div>
							<dt>Supported NIPs</dt>
							<dd>
								{supportedNips == null ? '' : String(((supportedNips).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const supportedNips = resolvedEntity.supportedNips}
					{#if supportedNips !== undefined && supportedNips !== null}
						<div>
							<dt>Supported NIPs</dt>
							<dd>
								{supportedNips == null ? '' : String(((supportedNips).join(', ')) ?? '')}
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
				{#snippet Pending()}
					{@const isPaid = pendingEntity.isPaid}
					{#if isPaid !== undefined && isPaid !== null}
						<div>
							<dt>Paid relay</dt>
							<dd>
								{isPaid ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isPaid = resolvedEntity.isPaid}
					{#if isPaid !== undefined && isPaid !== null}
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
				{#snippet Pending()}
					{@const activeUsers = pendingEntity.activeUsers}
					{#if activeUsers !== undefined && activeUsers !== null}
						<div>
							<dt>Active users</dt>
							<dd>
								{String((activeUsers) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeUsers = resolvedEntity.activeUsers}
					{#if activeUsers !== undefined && activeUsers !== null}
						<div>
							<dt>Active users</dt>
							<dd>
								{String((activeUsers) ?? '')}
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
				{#snippet Pending()}
					{@const eventsPerDay = pendingEntity.eventsPerDay}
					{#if eventsPerDay !== undefined && eventsPerDay !== null}
						<div>
							<dt>Events per day</dt>
							<dd>
								{String((eventsPerDay) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const eventsPerDay = resolvedEntity.eventsPerDay}
					{#if eventsPerDay !== undefined && eventsPerDay !== null}
						<div>
							<dt>Events per day</dt>
							<dd>
								{String((eventsPerDay) ?? '')}
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
				{#snippet Pending()}
					{@const rank = pendingEntity.rank}
					{#if rank !== undefined && rank !== null}
						<div>
							<dt>Rank</dt>
							<dd>
								{String((rank) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rank = resolvedEntity.rank}
					{#if rank !== undefined && rank !== null}
						<div>
							<dt>Rank</dt>
							<dd>
								{String((rank) ?? '')}
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
							paymentsUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentsUrl = pendingEntity.paymentsUrl}
					{#if paymentsUrl !== undefined && paymentsUrl !== null}
						<div>
							<dt>Payments URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(paymentsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(paymentsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentsUrl = resolvedEntity.paymentsUrl}
					{#if paymentsUrl !== undefined && paymentsUrl !== null}
						<div>
							<dt>Payments URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(paymentsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(paymentsUrl)} />
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
							termsOfServiceUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const termsOfServiceUrl = pendingEntity.termsOfServiceUrl}
					{#if termsOfServiceUrl !== undefined && termsOfServiceUrl !== null}
						<div>
							<dt>Terms of service URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(termsOfServiceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(termsOfServiceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const termsOfServiceUrl = resolvedEntity.termsOfServiceUrl}
					{#if termsOfServiceUrl !== undefined && termsOfServiceUrl !== null}
						<div>
							<dt>Terms of service URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(termsOfServiceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(termsOfServiceUrl)} />
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
							iconUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const iconUrl = pendingEntity.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const iconUrl = resolvedEntity.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
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
							bannerUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bannerUrl = pendingEntity.bannerUrl}
					{#if bannerUrl !== undefined && bannerUrl !== null}
						<div>
							<dt>Banner URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bannerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bannerUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bannerUrl = resolvedEntity.bannerUrl}
					{#if bannerUrl !== undefined && bannerUrl !== null}
						<div>
							<dt>Banner URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(bannerUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(bannerUrl)} />
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
							pubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pubkey = pendingEntity.pubkey}
					{#if pubkey !== undefined && pubkey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								{String((pubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pubkey = resolvedEntity.pubkey}
					{#if pubkey !== undefined && pubkey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								{String((pubkey) ?? '')}
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
				{#snippet Pending()}
					{@const error = pendingEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Relay</dt>
				<dd>
					<NostrRelayView
						selection={select(EntityType.NostrRelay, selection.entitySelector.$relay, {})}
						layout={EntityLayout.Value}
						open={false}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const description = resolvedEntity.description}
				{#if description !== undefined && description !== null && description !== ''}
					<p data-text="long-text">{String((description) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
