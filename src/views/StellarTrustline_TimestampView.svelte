<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.StellarTrustline_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.StellarTrustline_Timestamp>>
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
	const stellarTrustlineTimestamp = $derived(selection({}))
	const titleFallback = $derived('stellar trustline timestamp')
	const viewDomId = $derived('stellar-trustline-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StellarTrustlineView from '$/views/StellarTrustlineView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTrustline_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={stellarTrustlineTimestamp}>
			{#snippet Pending()}
				{title || 'stellar trustline timestamp'}
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
				<dt>trustline</dt>
				<dd>
					<StellarTrustlineView
						selection={select(EntityType.StellarTrustline, selection.entitySelector.$trustline, {})}
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
							ledgerSequence: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const ledgerSequence = pendingEntity.ledgerSequence}
					{#if ledgerSequence !== undefined && ledgerSequence !== null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{String((ledgerSequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const ledgerSequence = resolvedEntity.ledgerSequence}
					{#if ledgerSequence !== undefined && ledgerSequence !== null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{String((ledgerSequence) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balance = pendingEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance = resolvedEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								{String((balance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							limit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const limit = pendingEntity.limit}
					{#if limit !== undefined && limit !== null}
						<div>
							<dt>limit</dt>
							<dd>
								{String((limit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const limit = resolvedEntity.limit}
					{#if limit !== undefined && limit !== null}
						<div>
							<dt>limit</dt>
							<dd>
								{String((limit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							buyingLiabilities: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const buyingLiabilities = pendingEntity.buyingLiabilities}
					{#if buyingLiabilities !== undefined && buyingLiabilities !== null}
						<div>
							<dt>buying liabilities</dt>
							<dd>
								{String((buyingLiabilities) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const buyingLiabilities = resolvedEntity.buyingLiabilities}
					{#if buyingLiabilities !== undefined && buyingLiabilities !== null}
						<div>
							<dt>buying liabilities</dt>
							<dd>
								{String((buyingLiabilities) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sellingLiabilities: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sellingLiabilities = pendingEntity.sellingLiabilities}
					{#if sellingLiabilities !== undefined && sellingLiabilities !== null}
						<div>
							<dt>selling liabilities</dt>
							<dd>
								{String((sellingLiabilities) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sellingLiabilities = resolvedEntity.sellingLiabilities}
					{#if sellingLiabilities !== undefined && sellingLiabilities !== null}
						<div>
							<dt>selling liabilities</dt>
							<dd>
								{String((sellingLiabilities) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorized: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authorized = pendingEntity.authorized}
					{#if authorized !== undefined && authorized !== null}
						<div>
							<dt>authorized</dt>
							<dd>
								{authorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorized = resolvedEntity.authorized}
					{#if authorized !== undefined && authorized !== null}
						<div>
							<dt>authorized</dt>
							<dd>
								{authorized ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorizedToMaintainLiabilities: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authorizedToMaintainLiabilities = pendingEntity.authorizedToMaintainLiabilities}
					{#if authorizedToMaintainLiabilities !== undefined && authorizedToMaintainLiabilities !== null}
						<div>
							<dt>authorized to maintain liabilities</dt>
							<dd>
								{authorizedToMaintainLiabilities ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorizedToMaintainLiabilities = resolvedEntity.authorizedToMaintainLiabilities}
					{#if authorizedToMaintainLiabilities !== undefined && authorizedToMaintainLiabilities !== null}
						<div>
							<dt>authorized to maintain liabilities</dt>
							<dd>
								{authorizedToMaintainLiabilities ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							clawbackEnabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const clawbackEnabled = pendingEntity.clawbackEnabled}
					{#if clawbackEnabled !== undefined && clawbackEnabled !== null}
						<div>
							<dt>clawback enabled</dt>
							<dd>
								{clawbackEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const clawbackEnabled = resolvedEntity.clawbackEnabled}
					{#if clawbackEnabled !== undefined && clawbackEnabled !== null}
						<div>
							<dt>clawback enabled</dt>
							<dd>
								{clawbackEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
