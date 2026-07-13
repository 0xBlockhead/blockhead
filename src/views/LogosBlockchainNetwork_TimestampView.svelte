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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.LogosBlockchainNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LogosBlockchainNetwork_Timestamp>>
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
	const logosBlockchainNetworkTimestamp = $derived(selection({
		fields: {
			height: true,
			mode: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'Logos blockchain network timestamp')
	const viewDomId = $derived('logos-blockchain-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import LogosBlockchainNetworkView from '$/views/LogosBlockchainNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.LogosBlockchainNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={logosBlockchainNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={logosBlockchainNetworkTimestamp}>
			{#snippet Pending()}
				{@const height0 = pendingEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={logosBlockchainNetworkTimestamp}>
			{#snippet Pending()}
				{@const mode0 = pendingEntity.mode}
				{#if mode0 !== undefined && mode0 !== null}
					<span data-text="muted">
						{String((mode0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const mode0 = resolvedEntity.mode}
				{#if mode0 !== undefined && mode0 !== null}
					<span data-text="muted">
						{String((mode0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<LogosBlockchainNetworkView
						selection={select(EntityType.LogosBlockchainNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

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
							mode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mode = pendingEntity.mode}
					{#if mode !== undefined && mode !== null}
						<div>
							<dt>Mode</dt>
							<dd>
								{String((mode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mode = resolvedEntity.mode}
					{#if mode !== undefined && mode !== null}
						<div>
							<dt>Mode</dt>
							<dd>
								{String((mode) ?? '')}
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
							height: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const height = pendingEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const slot = pendingEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								<NumberValue value={Number(slot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>Slot</dt>
							<dd>
								<NumberValue value={Number(slot)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							libSlot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const libSlot = pendingEntity.libSlot}
					{#if libSlot !== undefined && libSlot !== null}
						<div>
							<dt>LIB slot</dt>
							<dd>
								<NumberValue value={Number(libSlot)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const libSlot = resolvedEntity.libSlot}
					{#if libSlot !== undefined && libSlot !== null}
						<div>
							<dt>LIB slot</dt>
							<dd>
								<NumberValue value={Number(libSlot)} />
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
							tip: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tip = pendingEntity.tip}
					{#if tip !== undefined && tip !== null}
						<div>
							<dt>Tip</dt>
							<dd>
								{String((tip) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tip = resolvedEntity.tip}
					{#if tip !== undefined && tip !== null}
						<div>
							<dt>Tip</dt>
							<dd>
								{String((tip) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lib: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lib = pendingEntity.lib}
					{#if lib !== undefined && lib !== null}
						<div>
							<dt>LIB</dt>
							<dd>
								{String((lib) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lib = resolvedEntity.lib}
					{#if lib !== undefined && lib !== null}
						<div>
							<dt>LIB</dt>
							<dd>
								{String((lib) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
