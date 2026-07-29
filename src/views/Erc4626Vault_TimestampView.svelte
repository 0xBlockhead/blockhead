<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.Erc4626Vault_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Defillama_OpenApi,
		],
	}))
	const erc4626VaultTimestamp = $derived(viewSelection({
		fields: {
			apyTotal: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4626Vault_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={erc4626VaultTimestamp}>
			{#snippet children(entity)}
				{@const apyTotal = entity.apyTotal}
				{#if apyTotal != null}
					<NumberValue
						value={apyTotal}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Vault</dt>
				<dd>
					<Erc4626VaultView
						selection={select(EntityType.Erc4626Vault, selection.entitySelector.$vault)}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							apyBase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const apyBase = entity.apyBase}
					{#if apyBase != null}
						<div>
							<dt>APY base</dt>
							<dd>
								<NumberValue
									value={apyBase}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							apyReward: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const apyReward = entity.apyReward}
					{#if apyReward != null}
						<div>
							<dt>APY reward</dt>
							<dd>
								<NumberValue
									value={apyReward}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={erc4626VaultTimestamp}
			>
				{#snippet children(entity)}
					{@const apyTotal = entity.apyTotal}
					{#if apyTotal != null}
						<div>
							<dt>APY total</dt>
							<dd>
								<NumberValue
									value={apyTotal}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tvlUsd: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tvlUsd = entity.tvlUsd}
					{#if tvlUsd != null}
						<div>
							<dt>TVL USD</dt>
							<dd>
								<NumberValue
									value={tvlUsd}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Reward tokens</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									rewardTokens: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.rewardTokens.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							poolId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolId = entity.poolId}
					{#if poolId != null}
						<div>
							<dt>Pool ID</dt>
							<dd>
								{poolId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							projectSlug: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const projectSlug = entity.projectSlug}
					{#if projectSlug != null}
						<div>
							<dt>Project slug</dt>
							<dd>
								{projectSlug}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							chainLabel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainLabel = entity.chainLabel}
					{#if chainLabel != null}
						<div>
							<dt>Chain label</dt>
							<dd>
								{chainLabel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
