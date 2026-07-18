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
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.LightningNode_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.LightningNode_Timestamp>>
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
	const lightningNodeTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			alias: true,
			capacitySats: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.alias) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning node timestamp')
	const viewDomId = $derived('lightning-node-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import LightningNodeView from '$/views/LightningNodeView.svelte'
</script>


<EntityView
	entityType={EntityType.LightningNode_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.alias) ?? ''), String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={lightningNodeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.alias) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const capacitySats0 = pendingEntity.capacitySats}
					{#if capacitySats0 !== undefined && capacitySats0 !== null}
						<NumberValue
							value={capacitySats0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={lightningNodeTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const capacitySats0 = resolvedEntity.capacitySats}
					{#if capacitySats0 !== undefined && capacitySats0 !== null}
						<NumberValue
							value={capacitySats0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Node</dt>
				<dd>
					<LightningNodeView
						selection={select(EntityType.LightningNode, selection.entitySelector.$node, {})}
						href={
							(selection.entitySelector.$node.publicKey !== undefined && selection.entitySelector.$node.$network !== undefined && selection.entitySelector.$node.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
								pubkey: String(selection.entitySelector.$node.publicKey ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$node.$network.caip2) ?? ''),
							}) : selection.entitySelector.$node.publicKey !== undefined && selection.entitySelector.$node.$network !== undefined && selection.entitySelector.$node.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/nodes/[pubkey=stringSegment]', {
								pubkey: String(selection.entitySelector.$node.publicKey ?? ''),
								network: String(selection.entitySelector.$node.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							color: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const color = resolvedEntity.color}
					{#if color !== undefined && color !== null}
						<div>
							<dt>Color</dt>
							<dd>
								{String((color) ?? '')}
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
							channelCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const channelCount = resolvedEntity.channelCount}
					{#if channelCount !== undefined && channelCount !== null}
						<div>
							<dt>Channels</dt>
							<dd>
								{String((channelCount) ?? '')}
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
							firstSeenMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstSeenMs = resolvedEntity.firstSeenMs}
					{#if firstSeenMs !== undefined && firstSeenMs !== null}
						<div>
							<dt>First seen</dt>
							<dd>
								{String((firstSeenMs) ?? '')}
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
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAtMs = resolvedEntity.updatedAtMs}
					{#if updatedAtMs !== undefined && updatedAtMs !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String((updatedAtMs) ?? '')}
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
							countryCode: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							city: true,
						},
					})
				}
			>
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

			<div>
				<dt>Network addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									networkAddresses: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const networkAddresses = resolvedEntity.networkAddresses}
							{#if networkAddresses !== undefined && networkAddresses !== null}
								<TruncatedValue value={networkAddresses.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
