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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGDataBlob>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZeroGDataBlob>>
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
	const zeroGDataBlob = $derived(selection({
		sources: [
			Source.ZeroGStorageScan_Rest,
			Source.ZeroGStorageNode_JsonRpc,
		],
		fields: {
			sizeBytes: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.dataRoot) ?? '')].filter(Boolean).join(' ') || 'zero g data blob')
	const viewDomId = $derived('zero-gdata-blob-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
	import ZeroGDaQuorumView from '$/views/ZeroGDaQuorumView.svelte'
	import ZeroGStorageLogEntryView from '$/views/ZeroGStorageLogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataBlob}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zeroGDataBlob}>
			{#snippet Pending()}
				{[String((pendingEntity.dataRoot) ?? '')].filter(Boolean).join(' ') || title || 'zero g data blob'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.dataRoot) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zeroGDataBlob}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
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
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
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
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGDataBlob}>
			{#snippet Pending()}
				{@const sizeBytes0 = pendingEntity.sizeBytes}
				{#if sizeBytes0 !== undefined && sizeBytes0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(sizeBytes0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sizeBytes0 = resolvedEntity.sizeBytes}
				{#if sizeBytes0 !== undefined && sizeBytes0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(sizeBytes0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
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

			<div>
				<dt>data root</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									dataRoot: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const dataRoot = pendingEntity.dataRoot}
							{#if dataRoot !== undefined && dataRoot !== null}
								{String((dataRoot) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dataRoot = resolvedEntity.dataRoot}
							{#if dataRoot !== undefined && dataRoot !== null}
								{String((dataRoot) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sizeBytes = pendingEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue value={Number(sizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sizeBytes = resolvedEntity.sizeBytes}
					{#if sizeBytes !== undefined && sizeBytes !== null}
						<div>
							<dt>size bytes</dt>
							<dd>
								<NumberValue value={Number(sizeBytes)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							erasureCodingScheme: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const erasureCodingScheme = pendingEntity.erasureCodingScheme}
					{#if erasureCodingScheme !== undefined && erasureCodingScheme !== null}
						<div>
							<dt>erasure coding scheme</dt>
							<dd>
								{String((erasureCodingScheme) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const erasureCodingScheme = resolvedEntity.erasureCodingScheme}
					{#if erasureCodingScheme !== undefined && erasureCodingScheme !== null}
						<div>
							<dt>erasure coding scheme</dt>
							<dd>
								{String((erasureCodingScheme) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							aggregatedSignature: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const aggregatedSignature = pendingEntity.aggregatedSignature}
					{#if aggregatedSignature !== undefined && aggregatedSignature !== null}
						<div>
							<dt>aggregated signature</dt>
							<dd>
								<TruncatedValue value={String((aggregatedSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const aggregatedSignature = resolvedEntity.aggregatedSignature}
					{#if aggregatedSignature !== undefined && aggregatedSignature !== null}
						<div>
							<dt>aggregated signature</dt>
							<dd>
								<TruncatedValue value={String((aggregatedSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$consensusNetwork}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(zeroGConsensusNetwork)}
					{#if zeroGConsensusNetwork != null && zeroGConsensusNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>consensus network</dt>
							<dd>
								<ZeroGConsensusNetworkView
									selection={select(EntityType.ZeroGConsensusNetwork, zeroGConsensusNetwork[EntityMetaKey.Selector])}
									prefetched={zeroGConsensusNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$daQuorum}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(zeroGDaQuorum)}
					{#if zeroGDaQuorum != null && zeroGDaQuorum[EntityMetaKey.Selector] != null}
						<div>
							<dt>DA quorum</dt>
							<dd>
								<ZeroGDaQuorumView
									selection={select(EntityType.ZeroGDaQuorum, zeroGDaQuorum[EntityMetaKey.Selector])}
									prefetched={zeroGDaQuorum}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$storageLogEntry}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(zeroGStorageLogEntry)}
					{#if zeroGStorageLogEntry != null && zeroGStorageLogEntry[EntityMetaKey.Selector] != null}
						<div>
							<dt>storage log entry</dt>
							<dd>
								<ZeroGStorageLogEntryView
									selection={select(EntityType.ZeroGStorageLogEntry, zeroGStorageLogEntry[EntityMetaKey.Selector])}
									prefetched={zeroGStorageLogEntry}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
