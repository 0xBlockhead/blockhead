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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidVaultEquity_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidVaultEquity_Timestamp>>
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
	const hyperliquidVaultEquityTimestamp = $derived(selection({}))
	const titleFallback = $derived('hyperliquid vault equity timestamp')
	const viewDomId = $derived('hyperliquid-vault-equity-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidVaultEquity_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidVaultEquityTimestamp}>
			{#snippet Pending()}
				{title || 'hyperliquid vault equity timestamp'}
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
				<dt>account</dt>
				<dd>
					<HyperliquidAccountView
						selection={select(EntityType.HyperliquidAccount, selection.entitySelector.$account, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>vault</dt>
				<dd>
					<HyperliquidVaultView
						selection={select(EntityType.HyperliquidVault, selection.entitySelector.$vault, {})}
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
							equity: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const equity = prefetched.equity}
					{#if equity !== undefined && equity !== null}
						<div>
							<dt>equity</dt>
							<dd>
								{String((equity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const equity = resolvedEntity.equity}
					{#if equity !== undefined && equity !== null}
						<div>
							<dt>equity</dt>
							<dd>
								{String((equity) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pnl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pnl = prefetched.pnl}
					{#if pnl !== undefined && pnl !== null}
						<div>
							<dt>pnl</dt>
							<dd>
								{String((pnl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pnl = resolvedEntity.pnl}
					{#if pnl !== undefined && pnl !== null}
						<div>
							<dt>pnl</dt>
							<dd>
								{String((pnl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allTimePnl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allTimePnl = prefetched.allTimePnl}
					{#if allTimePnl !== undefined && allTimePnl !== null}
						<div>
							<dt>all time pnl</dt>
							<dd>
								{String((allTimePnl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allTimePnl = resolvedEntity.allTimePnl}
					{#if allTimePnl !== undefined && allTimePnl !== null}
						<div>
							<dt>all time pnl</dt>
							<dd>
								{String((allTimePnl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							daysFollowing: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const daysFollowing = prefetched.daysFollowing}
					{#if daysFollowing !== undefined && daysFollowing !== null}
						<div>
							<dt>days following</dt>
							<dd>
								{String((daysFollowing) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const daysFollowing = resolvedEntity.daysFollowing}
					{#if daysFollowing !== undefined && daysFollowing !== null}
						<div>
							<dt>days following</dt>
							<dd>
								{String((daysFollowing) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							vaultEntryTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const vaultEntryTimeMs = prefetched.vaultEntryTimeMs}
					{#if vaultEntryTimeMs !== undefined && vaultEntryTimeMs !== null}
						<div>
							<dt>vault entry time ms</dt>
							<dd>
								{String((vaultEntryTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const vaultEntryTimeMs = resolvedEntity.vaultEntryTimeMs}
					{#if vaultEntryTimeMs !== undefined && vaultEntryTimeMs !== null}
						<div>
							<dt>vault entry time ms</dt>
							<dd>
								{String((vaultEntryTimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lockupUntilMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lockupUntilMs = prefetched.lockupUntilMs}
					{#if lockupUntilMs !== undefined && lockupUntilMs !== null}
						<div>
							<dt>lockup until ms</dt>
							<dd>
								{String((lockupUntilMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lockupUntilMs = resolvedEntity.lockupUntilMs}
					{#if lockupUntilMs !== undefined && lockupUntilMs !== null}
						<div>
							<dt>lockup until ms</dt>
							<dd>
								{String((lockupUntilMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
