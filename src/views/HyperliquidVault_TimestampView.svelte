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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidVault_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidVault_Timestamp>>
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
	const hyperliquidVaultTimestamp = $derived(selection({}))
	const titleFallback = $derived('hyperliquid vault timestamp')
	const viewDomId = $derived('hyperliquid-vault-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidVault_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidVaultTimestamp}>
			{#snippet Pending()}
				{title || 'hyperliquid vault timestamp'}
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
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							description: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const description = pendingEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const description = resolvedEntity.description}
					{#if description !== undefined && description !== null}
						<div>
							<dt>Description</dt>
							<dd>
								{String((description) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							apr: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const apr = pendingEntity.apr}
					{#if apr !== undefined && apr !== null}
						<div>
							<dt>apr</dt>
							<dd>
								{String((apr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const apr = resolvedEntity.apr}
					{#if apr !== undefined && apr !== null}
						<div>
							<dt>apr</dt>
							<dd>
								{String((apr) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							leaderFraction: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const leaderFraction = pendingEntity.leaderFraction}
					{#if leaderFraction !== undefined && leaderFraction !== null}
						<div>
							<dt>leader fraction</dt>
							<dd>
								{String((leaderFraction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const leaderFraction = resolvedEntity.leaderFraction}
					{#if leaderFraction !== undefined && leaderFraction !== null}
						<div>
							<dt>leader fraction</dt>
							<dd>
								{String((leaderFraction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							leaderCommission: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const leaderCommission = pendingEntity.leaderCommission}
					{#if leaderCommission !== undefined && leaderCommission !== null}
						<div>
							<dt>leader commission</dt>
							<dd>
								{String((leaderCommission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const leaderCommission = resolvedEntity.leaderCommission}
					{#if leaderCommission !== undefined && leaderCommission !== null}
						<div>
							<dt>leader commission</dt>
							<dd>
								{String((leaderCommission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxDistributable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxDistributable = pendingEntity.maxDistributable}
					{#if maxDistributable !== undefined && maxDistributable !== null}
						<div>
							<dt>max distributable</dt>
							<dd>
								{String((maxDistributable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxDistributable = resolvedEntity.maxDistributable}
					{#if maxDistributable !== undefined && maxDistributable !== null}
						<div>
							<dt>max distributable</dt>
							<dd>
								{String((maxDistributable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxWithdrawable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxWithdrawable = pendingEntity.maxWithdrawable}
					{#if maxWithdrawable !== undefined && maxWithdrawable !== null}
						<div>
							<dt>max withdrawable</dt>
							<dd>
								{String((maxWithdrawable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxWithdrawable = resolvedEntity.maxWithdrawable}
					{#if maxWithdrawable !== undefined && maxWithdrawable !== null}
						<div>
							<dt>max withdrawable</dt>
							<dd>
								{String((maxWithdrawable) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isClosed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isClosed = pendingEntity.isClosed}
					{#if isClosed !== undefined && isClosed !== null}
						<div>
							<dt>is closed</dt>
							<dd>
								{String((isClosed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isClosed = resolvedEntity.isClosed}
					{#if isClosed !== undefined && isClosed !== null}
						<div>
							<dt>is closed</dt>
							<dd>
								{String((isClosed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allowDeposits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const allowDeposits = pendingEntity.allowDeposits}
					{#if allowDeposits !== undefined && allowDeposits !== null}
						<div>
							<dt>allow deposits</dt>
							<dd>
								{String((allowDeposits) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const allowDeposits = resolvedEntity.allowDeposits}
					{#if allowDeposits !== undefined && allowDeposits !== null}
						<div>
							<dt>allow deposits</dt>
							<dd>
								{String((allowDeposits) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							alwaysCloseOnWithdraw: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const alwaysCloseOnWithdraw = pendingEntity.alwaysCloseOnWithdraw}
					{#if alwaysCloseOnWithdraw !== undefined && alwaysCloseOnWithdraw !== null}
						<div>
							<dt>always close on withdraw</dt>
							<dd>
								{String((alwaysCloseOnWithdraw) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const alwaysCloseOnWithdraw = resolvedEntity.alwaysCloseOnWithdraw}
					{#if alwaysCloseOnWithdraw !== undefined && alwaysCloseOnWithdraw !== null}
						<div>
							<dt>always close on withdraw</dt>
							<dd>
								{String((alwaysCloseOnWithdraw) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							followerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const followerCount = pendingEntity.followerCount}
					{#if followerCount !== undefined && followerCount !== null}
						<div>
							<dt>follower count</dt>
							<dd>
								{String((followerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const followerCount = resolvedEntity.followerCount}
					{#if followerCount !== undefined && followerCount !== null}
						<div>
							<dt>follower count</dt>
							<dd>
								{String((followerCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
