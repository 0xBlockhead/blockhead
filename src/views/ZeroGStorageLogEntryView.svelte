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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageLogEntry>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZeroGStorageLogEntry>>
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
	const zeroGStorageLogEntry = $derived(selection({
		sources: [
			Source.ZeroGStorageScan_Rest,
		],
		fields: {
			sequenceNumber: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.logEntryId) ?? '')].filter(Boolean).join(' ') || 'zero g storage log entry')
	const viewDomId = $derived('zero-gstorage-log-entry-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGStorageLogEntry}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zeroGStorageLogEntry}>
			{#snippet Pending()}
				{[String((pendingEntity.logEntryId) ?? '')].filter(Boolean).join(' ') || title || 'zero g storage log entry'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.logEntryId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zeroGStorageLogEntry}>
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
		<ResourceBoundary resource={zeroGStorageLogEntry}>
			{#snippet Pending()}
				{@const sequenceNumber0 = pendingEntity.sequenceNumber}
				{#if sequenceNumber0 !== undefined && sequenceNumber0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(sequenceNumber0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sequenceNumber0 = resolvedEntity.sequenceNumber}
				{#if sequenceNumber0 !== undefined && sequenceNumber0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(sequenceNumber0)} />
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
				<dt>log entry ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									logEntryId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const logEntryId = pendingEntity.logEntryId}
							{#if logEntryId !== undefined && logEntryId !== null}
								{String((logEntryId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const logEntryId = resolvedEntity.logEntryId}
							{#if logEntryId !== undefined && logEntryId !== null}
								{String((logEntryId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$dataBlob}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(zeroGDataBlob)}
					{#if zeroGDataBlob != null && zeroGDataBlob[EntityMetaKey.Selector] != null}
						<div>
							<dt>data blob</dt>
							<dd>
								<ZeroGDataBlobView
									selection={select(EntityType.ZeroGDataBlob, zeroGDataBlob[EntityMetaKey.Selector])}
									prefetched={zeroGDataBlob}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
				resource={
					selection({
						fields: {
							sequenceNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sequenceNumber = pendingEntity.sequenceNumber}
					{#if sequenceNumber !== undefined && sequenceNumber !== null}
						<div>
							<dt>sequence number</dt>
							<dd>
								<NumberValue value={Number(sequenceNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequenceNumber = resolvedEntity.sequenceNumber}
					{#if sequenceNumber !== undefined && sequenceNumber !== null}
						<div>
							<dt>sequence number</dt>
							<dd>
								<NumberValue value={Number(sequenceNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commitment = pendingEntity.commitment}
					{#if commitment !== undefined && commitment !== null}
						<div>
							<dt>commitment</dt>
							<dd>
								{String((commitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitment = resolvedEntity.commitment}
					{#if commitment !== undefined && commitment !== null}
						<div>
							<dt>commitment</dt>
							<dd>
								{String((commitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
