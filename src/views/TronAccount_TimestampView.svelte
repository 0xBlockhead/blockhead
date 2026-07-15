<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.TronAccount_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.TronAccount_Timestamp>>
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
	const tronAccountTimestamp = $derived(selection({}))
	const titleFallback = $derived('tron account timestamp')
	const viewDomId = $derived('tron-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TronAccountView from '$/views/TronAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TronAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tronAccountTimestamp}>
			{#snippet Pending()}
				{title || 'tron account timestamp'}
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
				<dt>Account</dt>
				<dd>
					<TronAccountView
						selection={select(EntityType.TronAccount, selection.entitySelector.$account, {})}
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
							blockHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockHeight = pendingEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>Block height</dt>
							<dd>
								{String((blockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockHeight = resolvedEntity.blockHeight}
					{#if blockHeight !== undefined && blockHeight !== null}
						<div>
							<dt>Block height</dt>
							<dd>
								{String((blockHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
							Source.TronFullNode_Rest,
							Source.TronSolidityNode_Rest,
							Source.TronScan_Rest,
						],
						fields: {
							balanceSun: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceSun = pendingEntity.balanceSun}
					{#if balanceSun !== undefined && balanceSun !== null}
						<div>
							<dt>Balance sun</dt>
							<dd>
								{String((balanceSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceSun = resolvedEntity.balanceSun}
					{#if balanceSun !== undefined && balanceSun !== null}
						<div>
							<dt>Balance sun</dt>
							<dd>
								{String((balanceSun) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronScan_Rest,
						],
						fields: {
							createdTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdTimestampMs = pendingEntity.createdTimestampMs}
					{#if createdTimestampMs !== undefined && createdTimestampMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdTimestampMs = resolvedEntity.createdTimestampMs}
					{#if createdTimestampMs !== undefined && createdTimestampMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronScan_Rest,
						],
						fields: {
							latestOperationTimestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latestOperationTimestampMs = pendingEntity.latestOperationTimestampMs}
					{#if latestOperationTimestampMs !== undefined && latestOperationTimestampMs !== null}
						<div>
							<dt>Latest operation</dt>
							<dd>
								<Timestamp timestamp={Number(latestOperationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latestOperationTimestampMs = resolvedEntity.latestOperationTimestampMs}
					{#if latestOperationTimestampMs !== undefined && latestOperationTimestampMs !== null}
						<div>
							<dt>Latest operation</dt>
							<dd>
								<Timestamp timestamp={Number(latestOperationTimestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronScan_Rest,
						],
						fields: {
							totalTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const totalTransactionCount = pendingEntity.totalTransactionCount}
					{#if totalTransactionCount !== undefined && totalTransactionCount !== null}
						<div>
							<dt>Total transactions</dt>
							<dd>
								{String((totalTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const totalTransactionCount = resolvedEntity.totalTransactionCount}
					{#if totalTransactionCount !== undefined && totalTransactionCount !== null}
						<div>
							<dt>Total transactions</dt>
							<dd>
								{String((totalTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							freeNetUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freeNetUsed = pendingEntity.freeNetUsed}
					{#if freeNetUsed !== undefined && freeNetUsed !== null}
						<div>
							<dt>Free net used</dt>
							<dd>
								{String((freeNetUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeNetUsed = resolvedEntity.freeNetUsed}
					{#if freeNetUsed !== undefined && freeNetUsed !== null}
						<div>
							<dt>Free net used</dt>
							<dd>
								{String((freeNetUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							freeNetLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freeNetLimit = pendingEntity.freeNetLimit}
					{#if freeNetLimit !== undefined && freeNetLimit !== null}
						<div>
							<dt>Free net limit</dt>
							<dd>
								{String((freeNetLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freeNetLimit = resolvedEntity.freeNetLimit}
					{#if freeNetLimit !== undefined && freeNetLimit !== null}
						<div>
							<dt>Free net limit</dt>
							<dd>
								{String((freeNetLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							netUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const netUsed = pendingEntity.netUsed}
					{#if netUsed !== undefined && netUsed !== null}
						<div>
							<dt>Net used</dt>
							<dd>
								{String((netUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const netUsed = resolvedEntity.netUsed}
					{#if netUsed !== undefined && netUsed !== null}
						<div>
							<dt>Net used</dt>
							<dd>
								{String((netUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							netLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const netLimit = pendingEntity.netLimit}
					{#if netLimit !== undefined && netLimit !== null}
						<div>
							<dt>Net limit</dt>
							<dd>
								{String((netLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const netLimit = resolvedEntity.netLimit}
					{#if netLimit !== undefined && netLimit !== null}
						<div>
							<dt>Net limit</dt>
							<dd>
								{String((netLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							energyUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const energyUsed = pendingEntity.energyUsed}
					{#if energyUsed !== undefined && energyUsed !== null}
						<div>
							<dt>Energy used</dt>
							<dd>
								{String((energyUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const energyUsed = resolvedEntity.energyUsed}
					{#if energyUsed !== undefined && energyUsed !== null}
						<div>
							<dt>Energy used</dt>
							<dd>
								{String((energyUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronGrid_Rest,
						],
						fields: {
							energyLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const energyLimit = pendingEntity.energyLimit}
					{#if energyLimit !== undefined && energyLimit !== null}
						<div>
							<dt>Energy limit</dt>
							<dd>
								{String((energyLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const energyLimit = resolvedEntity.energyLimit}
					{#if energyLimit !== undefined && energyLimit !== null}
						<div>
							<dt>Energy limit</dt>
							<dd>
								{String((energyLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tronPowerUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tronPowerUsed = pendingEntity.tronPowerUsed}
					{#if tronPowerUsed !== undefined && tronPowerUsed !== null}
						<div>
							<dt>TRON power used</dt>
							<dd>
								{String((tronPowerUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tronPowerUsed = resolvedEntity.tronPowerUsed}
					{#if tronPowerUsed !== undefined && tronPowerUsed !== null}
						<div>
							<dt>TRON power used</dt>
							<dd>
								{String((tronPowerUsed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tronPowerLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tronPowerLimit = pendingEntity.tronPowerLimit}
					{#if tronPowerLimit !== undefined && tronPowerLimit !== null}
						<div>
							<dt>TRON power limit</dt>
							<dd>
								{String((tronPowerLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tronPowerLimit = resolvedEntity.tronPowerLimit}
					{#if tronPowerLimit !== undefined && tronPowerLimit !== null}
						<div>
							<dt>TRON power limit</dt>
							<dd>
								{String((tronPowerLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.TronScan_Rest,
						],
						fields: {
							isContract: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isContract = pendingEntity.isContract}
					{#if isContract !== undefined && isContract !== null}
						<div>
							<dt>Contract</dt>
							<dd>
								{isContract ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isContract = resolvedEntity.isContract}
					{#if isContract !== undefined && isContract !== null}
						<div>
							<dt>Contract</dt>
							<dd>
								{isContract ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
