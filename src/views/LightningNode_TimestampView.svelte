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
			selection: EntityProxyResource<typeof schema, EntityType.LightningNode_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LightningNode_Timestamp>>
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
		fields: {
			alias: true,
			capacitySats: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.alias) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Lightning node timestamp')
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
		<ResourceBoundary resource={lightningNodeTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.alias) ?? ''), String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'Lightning node timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.alias) ?? ''), String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lightningNodeTimestamp}>
			{#snippet Pending()}
				{@const capacitySats0 = prefetched.capacitySats}
				{#if capacitySats0 !== undefined && capacitySats0 !== null}
					<NumberValue value={Number(capacitySats0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const capacitySats0 = resolvedEntity.capacitySats}
				{#if capacitySats0 !== undefined && capacitySats0 !== null}
					<NumberValue value={Number(capacitySats0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Node</dt>
				<dd>
					<LightningNodeView
						selection={select(EntityType.LightningNode, selection.entitySelector.$node, {})}
						href={
							(selection.entitySelector.$node.$network !== undefined && selection.entitySelector.$node.$network.slug !== undefined && selection.entitySelector.$node.publicKey !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/nodes/[pubkey]', {
								networkSlug: String(selection.entitySelector.$node.$network.slug ?? ''),
								pubkey: String(selection.entitySelector.$node.publicKey ?? ''),
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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							color: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const color = prefetched.color}
					{#if color !== undefined && color !== null}
						<div>
							<dt>Color</dt>
							<dd>
								{String((color) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							channelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const channelCount = prefetched.channelCount}
					{#if channelCount !== undefined && channelCount !== null}
						<div>
							<dt>Channels</dt>
							<dd>
								{String((channelCount) ?? '')}
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
								{String((channelCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							firstSeenMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const firstSeenMs = prefetched.firstSeenMs}
					{#if firstSeenMs !== undefined && firstSeenMs !== null}
						<div>
							<dt>First seen</dt>
							<dd>
								{String((firstSeenMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.LightningMempoolSpace_Rest,
							Source.LightningLnd_Rest,
						],
						fields: {
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAtMs = prefetched.updatedAtMs}
					{#if updatedAtMs !== undefined && updatedAtMs !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String((updatedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							countryCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const countryCode = prefetched.countryCode}
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
						sources: [
							Source.LightningMempoolSpace_Rest,
						],
						fields: {
							city: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const city = prefetched.city}
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

			<div>
				<dt>Network addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.LightningMempoolSpace_Rest,
								],
								fields: {
									networkAddresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const networkAddresses = prefetched.networkAddresses}
							{#if networkAddresses !== undefined && networkAddresses !== null}
								<TruncatedValue value={networkAddresses.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

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
