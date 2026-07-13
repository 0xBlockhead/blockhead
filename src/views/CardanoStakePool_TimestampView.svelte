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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoStakePool_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CardanoStakePool_Timestamp>>
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
	const cardanoStakePoolTimestamp = $derived(selection({}))
	const titleFallback = $derived('Cardano stake pool timestamp')
	const viewDomId = $derived('cardano-stake-pool-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoStakePool_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cardanoStakePoolTimestamp}>
			{#snippet Pending()}
				{title || 'Cardano stake pool timestamp'}
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
				<dt>pool</dt>
				<dd>
					<CardanoStakePoolView
						selection={select(EntityType.CardanoStakePool, selection.entitySelector.$pool, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>epoch</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									epoch: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const epoch = pendingEntity.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const epoch = resolvedEntity.epoch}
							{#if epoch !== undefined && epoch !== null}
								{String((epoch) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
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
				{#snippet Pending()}
					{@const slot = pendingEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>slot</dt>
							<dd>
								{String((slot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const slot = resolvedEntity.slot}
					{#if slot !== undefined && slot !== null}
						<div>
							<dt>slot</dt>
							<dd>
								{String((slot) ?? '')}
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
				{#snippet Pending()}
					{@const pledge = pendingEntity.pledge}
					{#if pledge !== undefined && pledge !== null}
						<div>
							<dt>pledge</dt>
							<dd>
								{String((pledge) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pledge = resolvedEntity.pledge}
					{#if pledge !== undefined && pledge !== null}
						<div>
							<dt>pledge</dt>
							<dd>
								{String((pledge) ?? '')}
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
				{#snippet Pending()}
					{@const margin = pendingEntity.margin}
					{#if margin !== undefined && margin !== null}
						<div>
							<dt>margin</dt>
							<dd>
								{String((margin) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const margin = resolvedEntity.margin}
					{#if margin !== undefined && margin !== null}
						<div>
							<dt>margin</dt>
							<dd>
								{String((margin) ?? '')}
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
				{#snippet Pending()}
					{@const fixedCostLovelace = pendingEntity.fixedCostLovelace}
					{#if fixedCostLovelace !== undefined && fixedCostLovelace !== null}
						<div>
							<dt>fixed cost lovelace</dt>
							<dd>
								{String((fixedCostLovelace) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fixedCostLovelace = resolvedEntity.fixedCostLovelace}
					{#if fixedCostLovelace !== undefined && fixedCostLovelace !== null}
						<div>
							<dt>fixed cost lovelace</dt>
							<dd>
								{String((fixedCostLovelace) ?? '')}
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
				{#snippet Pending()}
					{@const rewardAccount = pendingEntity.rewardAccount}
					{#if rewardAccount !== undefined && rewardAccount !== null}
						<div>
							<dt>reward account</dt>
							<dd>
								<TruncatedValue value={String((rewardAccount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rewardAccount = resolvedEntity.rewardAccount}
					{#if rewardAccount !== undefined && rewardAccount !== null}
						<div>
							<dt>reward account</dt>
							<dd>
								<TruncatedValue value={String((rewardAccount) ?? '')} />
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
						{#snippet Pending()}
							{@const owners = pendingEntity.owners}
							{#if owners !== undefined && owners !== null}
								{owners.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const owners = resolvedEntity.owners}
							{#if owners !== undefined && owners !== null}
								{owners.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
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
				{#snippet Pending()}
					{@const metadataUrl = pendingEntity.metadataUrl}
					{#if metadataUrl !== undefined && metadataUrl !== null}
						<div>
							<dt>metadata URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataUrl = resolvedEntity.metadataUrl}
					{#if metadataUrl !== undefined && metadataUrl !== null}
						<div>
							<dt>metadata URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(metadataUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(metadataUrl)} />
								</svelte:element>
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
				{#snippet Pending()}
					{@const metadataHash = pendingEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const metadataHash = resolvedEntity.metadataHash}
					{#if metadataHash !== undefined && metadataHash !== null}
						<div>
							<dt>metadata hash</dt>
							<dd>
								<TruncatedValue value={String((metadataHash) ?? '')} />
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
				{#snippet Pending()}
					{@const liveStake = pendingEntity.liveStake}
					{#if liveStake !== undefined && liveStake !== null}
						<div>
							<dt>live stake</dt>
							<dd>
								{String((liveStake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const liveStake = resolvedEntity.liveStake}
					{#if liveStake !== undefined && liveStake !== null}
						<div>
							<dt>live stake</dt>
							<dd>
								{String((liveStake) ?? '')}
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
				{#snippet Pending()}
					{@const activeStake = pendingEntity.activeStake}
					{#if activeStake !== undefined && activeStake !== null}
						<div>
							<dt>active stake</dt>
							<dd>
								{String((activeStake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeStake = resolvedEntity.activeStake}
					{#if activeStake !== undefined && activeStake !== null}
						<div>
							<dt>active stake</dt>
							<dd>
								{String((activeStake) ?? '')}
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
				{#snippet Pending()}
					{@const delegatorCount = pendingEntity.delegatorCount}
					{#if delegatorCount !== undefined && delegatorCount !== null}
						<div>
							<dt>delegator count</dt>
							<dd>
								{String((delegatorCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const delegatorCount = resolvedEntity.delegatorCount}
					{#if delegatorCount !== undefined && delegatorCount !== null}
						<div>
							<dt>delegator count</dt>
							<dd>
								{String((delegatorCount) ?? '')}
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
				{#snippet Pending()}
					{@const blockCount = pendingEntity.blockCount}
					{#if blockCount !== undefined && blockCount !== null}
						<div>
							<dt>block count</dt>
							<dd>
								{String((blockCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockCount = resolvedEntity.blockCount}
					{#if blockCount !== undefined && blockCount !== null}
						<div>
							<dt>block count</dt>
							<dd>
								{String((blockCount) ?? '')}
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
				{#snippet Pending()}
					{@const saturation = pendingEntity.saturation}
					{#if saturation !== undefined && saturation !== null}
						<div>
							<dt>saturation</dt>
							<dd>
								{String((saturation) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const saturation = resolvedEntity.saturation}
					{#if saturation !== undefined && saturation !== null}
						<div>
							<dt>saturation</dt>
							<dd>
								{String((saturation) ?? '')}
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
				{#snippet Pending()}
					{@const retired = pendingEntity.retired}
					{#if retired !== undefined && retired !== null}
						<div>
							<dt>retired</dt>
							<dd>
								{retired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const retired = resolvedEntity.retired}
					{#if retired !== undefined && retired !== null}
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
