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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFedimintClientState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadFedimintClientState_Timestamp>>
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
	const blockheadFedimintClientStateTimestamp = $derived(selection({
		fields: {
			balanceMsat: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Fedimint client state timestamp')
	const viewDomId = $derived('blockhead-fedimint-client-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadFedimintClientStateView from '$/views/BlockheadFedimintClientStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadFedimintClientState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadFedimintClientStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
		<ResourceBoundary resource={blockheadFedimintClientStateTimestamp}>
			{#snippet Pending()}
				{@const balanceMsat0 = prefetched.balanceMsat}
				{#if balanceMsat0 !== undefined && balanceMsat0 !== null}
					<NumberValue value={Number(balanceMsat0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balanceMsat0 = resolvedEntity.balanceMsat}
				{#if balanceMsat0 !== undefined && balanceMsat0 !== null}
					<NumberValue value={Number(balanceMsat0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadFedimintClientStateTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>client state</dt>
				<dd>
					<BlockheadFedimintClientStateView
						selection={select(EntityType.BlockheadFedimintClientState, selection.entitySelector.$clientState)}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
						fields: {
							recoveryState: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const recoveryState = prefetched.recoveryState}
					{#if recoveryState !== undefined && recoveryState !== null}
						<div>
							<dt>recovery state</dt>
							<dd>
								{String((recoveryState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recoveryState = resolvedEntity.recoveryState}
					{#if recoveryState !== undefined && recoveryState !== null}
						<div>
							<dt>recovery state</dt>
							<dd>
								{String((recoveryState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = prefetched.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
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
							balanceMsat: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceMsat = prefetched.balanceMsat}
					{#if balanceMsat !== undefined && balanceMsat !== null}
						<div>
							<dt>balance msat</dt>
							<dd>
								<NumberValue value={Number(balanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceMsat = resolvedEntity.balanceMsat}
					{#if balanceMsat !== undefined && balanceMsat !== null}
						<div>
							<dt>balance msat</dt>
							<dd>
								<NumberValue value={Number(balanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ecashBalanceMsat: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ecashBalanceMsat = prefetched.ecashBalanceMsat}
					{#if ecashBalanceMsat !== undefined && ecashBalanceMsat !== null}
						<div>
							<dt>ecash balance msat</dt>
							<dd>
								<NumberValue value={Number(ecashBalanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ecashBalanceMsat = resolvedEntity.ecashBalanceMsat}
					{#if ecashBalanceMsat !== undefined && ecashBalanceMsat !== null}
						<div>
							<dt>ecash balance msat</dt>
							<dd>
								<NumberValue value={Number(ecashBalanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lightningBalanceMsat: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lightningBalanceMsat = prefetched.lightningBalanceMsat}
					{#if lightningBalanceMsat !== undefined && lightningBalanceMsat !== null}
						<div>
							<dt>Lightning balance msat</dt>
							<dd>
								<NumberValue value={Number(lightningBalanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lightningBalanceMsat = resolvedEntity.lightningBalanceMsat}
					{#if lightningBalanceMsat !== undefined && lightningBalanceMsat !== null}
						<div>
							<dt>Lightning balance msat</dt>
							<dd>
								<NumberValue value={Number(lightningBalanceMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							onchainBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const onchainBalanceSats = prefetched.onchainBalanceSats}
					{#if onchainBalanceSats !== undefined && onchainBalanceSats !== null}
						<div>
							<dt>onchain balance sats</dt>
							<dd>
								<NumberValue value={Number(onchainBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const onchainBalanceSats = resolvedEntity.onchainBalanceSats}
					{#if onchainBalanceSats !== undefined && onchainBalanceSats !== null}
						<div>
							<dt>onchain balance sats</dt>
							<dd>
								<NumberValue value={Number(onchainBalanceSats)} />
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
							ecashNoteCountsJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ecashNoteCountsJson = prefetched.ecashNoteCountsJson}
					{#if ecashNoteCountsJson !== undefined && ecashNoteCountsJson !== null}
						<div>
							<dt>ecash note counts JSON</dt>
							<dd>
								{String((ecashNoteCountsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ecashNoteCountsJson = resolvedEntity.ecashNoteCountsJson}
					{#if ecashNoteCountsJson !== undefined && ecashNoteCountsJson !== null}
						<div>
							<dt>ecash note counts JSON</dt>
							<dd>
								{String((ecashNoteCountsJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							oobNotesJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const oobNotesJson = prefetched.oobNotesJson}
					{#if oobNotesJson !== undefined && oobNotesJson !== null}
						<div>
							<dt>oob notes JSON</dt>
							<dd>
								{String((oobNotesJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const oobNotesJson = resolvedEntity.oobNotesJson}
					{#if oobNotesJson !== undefined && oobNotesJson !== null}
						<div>
							<dt>oob notes JSON</dt>
							<dd>
								{String((oobNotesJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							operationSummaryJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const operationSummaryJson = prefetched.operationSummaryJson}
					{#if operationSummaryJson !== undefined && operationSummaryJson !== null}
						<div>
							<dt>operation summary JSON</dt>
							<dd>
								{String((operationSummaryJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const operationSummaryJson = resolvedEntity.operationSummaryJson}
					{#if operationSummaryJson !== undefined && operationSummaryJson !== null}
						<div>
							<dt>operation summary JSON</dt>
							<dd>
								{String((operationSummaryJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
