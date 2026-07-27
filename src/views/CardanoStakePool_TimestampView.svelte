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
	}: EntitySelectionViewProps<EntityType.CardanoStakePool_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'Cardano stake pool timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoStakePool_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Cardano stake pool timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>pool</dt>
				<dd>
					<CardanoStakePoolView
						selection={select(EntityType.CardanoStakePool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					{String(pendingEntity.epoch)}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slot = entity.slot}
					{#if slot != null}
						<div>
							<dt>slot</dt>
							<dd>
								{String(slot)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pledge: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pledge = entity.pledge}
					{#if pledge != null}
						<div>
							<dt>pledge</dt>
							<dd>
								{String(pledge)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							margin: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const margin = entity.margin}
					{#if margin != null}
						<div>
							<dt>margin</dt>
							<dd>
								{String(margin)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fixedCostLovelace: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fixedCostLovelace = entity.fixedCostLovelace}
					{#if fixedCostLovelace != null}
						<div>
							<dt>fixed cost lovelace</dt>
							<dd>
								{String(fixedCostLovelace)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rewardAccount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardAccount = entity.rewardAccount}
					{#if rewardAccount != null}
						<div>
							<dt>reward account</dt>
							<dd>
								<TruncatedValue value={rewardAccount} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>owners</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									owners: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.owners.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadataUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataUrl = entity.metadataUrl}
					{#if metadataUrl != null}
						<div>
							<dt>metadata URL</dt>
							<dd>
								<a
									href={String(metadataUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUrl)} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metadataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metadataHash = entity.metadataHash}
					{#if metadataHash != null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={metadataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							liveStake: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liveStake = entity.liveStake}
					{#if liveStake != null}
						<div>
							<dt>live stake</dt>
							<dd>
								{String(liveStake)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							activeStake: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeStake = entity.activeStake}
					{#if activeStake != null}
						<div>
							<dt>active stake</dt>
							<dd>
								{String(activeStake)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegatorCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegatorCount = entity.delegatorCount}
					{#if delegatorCount != null}
						<div>
							<dt>delegator count</dt>
							<dd>
								{String(delegatorCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockCount = entity.blockCount}
					{#if blockCount != null}
						<div>
							<dt>block count</dt>
							<dd>
								{String(blockCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							saturation: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const saturation = entity.saturation}
					{#if saturation != null}
						<div>
							<dt>saturation</dt>
							<dd>
								{String(saturation)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							retired: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const retired = entity.retired}
					{#if retired != null}
						<div>
							<dt>retired</dt>
							<dd>
								{retired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
