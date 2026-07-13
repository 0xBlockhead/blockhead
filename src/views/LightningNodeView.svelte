<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNode>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningNode>>
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
	const lightningNode = $derived(selection({
		sources: [
			Source.LightningMempoolSpace_Rest,
			Source.LightningLnd_Rest,
		],
		fields: {
			alias: true,
			capacitySats: true,
			channelCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.alias) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node')
	const viewDomId = $derived('lightning-node-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import LightningChannelsView from '$/views/LightningChannelsView.svelte'
	import BlockheadLightningNodeStatesView from '$/views/BlockheadLightningNodeStatesView.svelte'
	import LightningNode_TimestampsView from '$/views/LightningNode_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNode}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.publicKey !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			pubkey: String(pendingEntity.publicKey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lightningNode}>
			{#snippet Pending()}
				{[String((pendingEntity.alias) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.publicKey) ?? '')].filter(Boolean).join(' ') || 'Lightning node'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.alias) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningNode}>
			{#snippet Pending()}
				{@const channelCount0 = pendingEntity.channelCount}
				{#if channelCount0 !== undefined && channelCount0 !== null}
					<NumberValue value={Number(channelCount0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const channelCount0 = resolvedEntity.channelCount}
				{#if channelCount0 !== undefined && channelCount0 !== null}
					<NumberValue value={Number(channelCount0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Public key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									publicKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const publicKey = pendingEntity.publicKey}
							{#if publicKey !== undefined && publicKey !== null}
								<TruncatedValue value={String((publicKey) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const publicKey = resolvedEntity.publicKey}
							{#if publicKey !== undefined && publicKey !== null}
								<TruncatedValue value={String((publicKey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							capacitySats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const capacitySats = pendingEntity.capacitySats}
					{#if capacitySats !== undefined && capacitySats !== null}
						<div>
							<dt>Capacity sats</dt>
							<dd>
								<NumberValue value={Number(capacitySats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const capacitySats = resolvedEntity.capacitySats}
					{#if capacitySats !== undefined && capacitySats !== null}
						<div>
							<dt>Capacity sats</dt>
							<dd>
								<NumberValue value={Number(capacitySats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							channelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const channelCount = pendingEntity.channelCount}
					{#if channelCount !== undefined && channelCount !== null}
						<div>
							<dt>Channels</dt>
							<dd>
								<NumberValue value={Number(channelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const channelCount = resolvedEntity.channelCount}
					{#if channelCount !== undefined && channelCount !== null}
						<div>
							<dt>Channels</dt>
							<dd>
								<NumberValue value={Number(channelCount)} />
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
							countryCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const countryCode = pendingEntity.countryCode}
					{#if countryCode !== undefined && countryCode !== null}
						<div>
							<dt>Country</dt>
							<dd>
								{String((countryCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const countryCode = resolvedEntity.countryCode}
					{#if countryCode !== undefined && countryCode !== null}
						<div>
							<dt>Country</dt>
							<dd>
								{String((countryCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							city: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const city = pendingEntity.city}
					{#if city !== undefined && city !== null}
						<div>
							<dt>City</dt>
							<dd>
								{String((city) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const city = resolvedEntity.city}
					{#if city !== undefined && city !== null}
						<div>
							<dt>City</dt>
							<dd>
								{String((city) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							networkAddresses: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkAddresses = pendingEntity.networkAddresses}
					{#if networkAddresses !== undefined && networkAddresses !== null}
						<div>
							<dt>Network addresses</dt>
							<dd>
								{networkAddresses.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkAddresses = resolvedEntity.networkAddresses}
					{#if networkAddresses !== undefined && networkAddresses !== null}
						<div>
							<dt>Network addresses</dt>
							<dd>
								{networkAddresses.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-lightning-node-activity'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lightning-node-channels',
							label: 'Channels',
						},
						{
							id: 'lightning-node-local-node-states',
							label: 'Local Node States',
						},
					]
				}
				data-card
				class='network-view-collapsible-activity'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLightningNodeChannels({ id, label, open })}
					<LightningChannelsView
						selection={
							selection.$$channels({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No channels.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionLightningNodeLocalNodeStates({ id, label, open })}
					<BlockheadLightningNodeStatesView
						selection={
							selection.$$localNodeStates({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No local node states.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-lightning-node-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'lightning-node-timestamps',
							label: 'Timestamps',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLightningNodeTimestamps({ id, label, open })}
					<LightningNode_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No timestamps.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
