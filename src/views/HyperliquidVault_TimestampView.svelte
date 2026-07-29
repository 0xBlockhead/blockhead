<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidVault_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HyperliquidVaultView from '$/views/HyperliquidVaultView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidVault_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'hyperliquid vault timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		hyperliquid vault timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>vault</dt>
				<dd>
					<HyperliquidVaultView
						selection={select(EntityType.HyperliquidVault, selection.entitySelector.$vault)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
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
				{#snippet children(entity)}
					{@const description = entity.description}
					{#if description != null}
						<div>
							<dt>Description</dt>
							<dd>
								{description}
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
				{#snippet children(entity)}
					{@const apr = entity.apr}
					{#if apr != null}
						<div>
							<dt>apr</dt>
							<dd>
								{apr}
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
				{#snippet children(entity)}
					{@const leaderFraction = entity.leaderFraction}
					{#if leaderFraction != null}
						<div>
							<dt>leader fraction</dt>
							<dd>
								{leaderFraction}
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
				{#snippet children(entity)}
					{@const leaderCommission = entity.leaderCommission}
					{#if leaderCommission != null}
						<div>
							<dt>leader commission</dt>
							<dd>
								{leaderCommission}
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
				{#snippet children(entity)}
					{@const maxDistributable = entity.maxDistributable}
					{#if maxDistributable != null}
						<div>
							<dt>max distributable</dt>
							<dd>
								{maxDistributable}
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
				{#snippet children(entity)}
					{@const maxWithdrawable = entity.maxWithdrawable}
					{#if maxWithdrawable != null}
						<div>
							<dt>max withdrawable</dt>
							<dd>
								{maxWithdrawable}
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
				{#snippet children(entity)}
					{@const isClosed = entity.isClosed}
					{#if isClosed != null}
						<div>
							<dt>is closed</dt>
							<dd>
								{isClosed}
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
				{#snippet children(entity)}
					{@const allowDeposits = entity.allowDeposits}
					{#if allowDeposits != null}
						<div>
							<dt>allow deposits</dt>
							<dd>
								{allowDeposits}
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
				{#snippet children(entity)}
					{@const alwaysCloseOnWithdraw = entity.alwaysCloseOnWithdraw}
					{#if alwaysCloseOnWithdraw != null}
						<div>
							<dt>always close on withdraw</dt>
							<dd>
								{alwaysCloseOnWithdraw}
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
				{#snippet children(entity)}
					{@const followerCount = entity.followerCount}
					{#if followerCount != null}
						<div>
							<dt>follower count</dt>
							<dd>
								{followerCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
