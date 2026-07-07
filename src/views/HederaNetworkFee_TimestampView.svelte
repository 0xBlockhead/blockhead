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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNetworkFee_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaNetworkFee_Timestamp>>
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
	const hederaNetworkFeeTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera network fee timestamp')
	const viewDomId = $derived('hedera-network-fee-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HederaNetworkView from '$/views/HederaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNetworkFee_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNetworkFeeTimestamp}>
			{#snippet Pending()}
				{title || 'hedera network fee timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<HederaNetworkView
						selection={select(EntityType.HederaNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionType: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionType = selection.entitySelector.transactionType ?? prefetched.transactionType}
							{#if transactionType !== undefined && transactionType !== null}
								{String((transactionType) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionType = resolvedEntity.transactionType}
							{#if transactionType !== undefined && transactionType !== null}
								{String((transactionType) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
							gasTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasTinybar = prefetched.gasTinybar}
					{#if gasTinybar !== undefined && gasTinybar !== null}
						<div>
							<dt>gas tinybar</dt>
							<dd>
								{String((gasTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasTinybar = resolvedEntity.gasTinybar}
					{#if gasTinybar !== undefined && gasTinybar !== null}
						<div>
							<dt>gas tinybar</dt>
							<dd>
								{String((gasTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseTinycent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseTinycent = prefetched.baseTinycent}
					{#if baseTinycent !== undefined && baseTinycent !== null}
						<div>
							<dt>base tinycent</dt>
							<dd>
								{String((baseTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseTinycent = resolvedEntity.baseTinycent}
					{#if baseTinycent !== undefined && baseTinycent !== null}
						<div>
							<dt>base tinycent</dt>
							<dd>
								{String((baseTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeTinycent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeTinycent = prefetched.nodeTinycent}
					{#if nodeTinycent !== undefined && nodeTinycent !== null}
						<div>
							<dt>node tinycent</dt>
							<dd>
								{String((nodeTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeTinycent = resolvedEntity.nodeTinycent}
					{#if nodeTinycent !== undefined && nodeTinycent !== null}
						<div>
							<dt>node tinycent</dt>
							<dd>
								{String((nodeTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							networkTinycent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkTinycent = prefetched.networkTinycent}
					{#if networkTinycent !== undefined && networkTinycent !== null}
						<div>
							<dt>network tinycent</dt>
							<dd>
								{String((networkTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkTinycent = resolvedEntity.networkTinycent}
					{#if networkTinycent !== undefined && networkTinycent !== null}
						<div>
							<dt>network tinycent</dt>
							<dd>
								{String((networkTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							serviceTinycent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const serviceTinycent = prefetched.serviceTinycent}
					{#if serviceTinycent !== undefined && serviceTinycent !== null}
						<div>
							<dt>service tinycent</dt>
							<dd>
								{String((serviceTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const serviceTinycent = resolvedEntity.serviceTinycent}
					{#if serviceTinycent !== undefined && serviceTinycent !== null}
						<div>
							<dt>service tinycent</dt>
							<dd>
								{String((serviceTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalTinycent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalTinycent = prefetched.totalTinycent}
					{#if totalTinycent !== undefined && totalTinycent !== null}
						<div>
							<dt>total tinycent</dt>
							<dd>
								{String((totalTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalTinycent = resolvedEntity.totalTinycent}
					{#if totalTinycent !== undefined && totalTinycent !== null}
						<div>
							<dt>total tinycent</dt>
							<dd>
								{String((totalTinycent) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
