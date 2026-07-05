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
	import { EvmAddress } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4626Vault_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.Erc4626Vault_Timestamp>>
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
	const erc4626VaultTimestamp = $derived(selection({
		sources: [
			Source.Defillama_OpenApi,
		],
		fields: {
			apyTotal: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'erc4626 vault timestamp')
	const viewDomId = $derived('erc4626vault-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Erc4626VaultView from '$/views/Erc4626VaultView.svelte'
</script>


<EntityView
	entityType={EntityType.Erc4626Vault_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={erc4626VaultTimestamp}>
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
		<ResourceBoundary resource={erc4626VaultTimestamp}>
			{#snippet Pending()}
				{@const apyTotal0 = prefetched.apyTotal}
				{#if apyTotal0 !== undefined && apyTotal0 !== null}
					<NumberValue value={Number(apyTotal0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const apyTotal0 = resolvedEntity.apyTotal}
				{#if apyTotal0 !== undefined && apyTotal0 !== null}
					<NumberValue value={Number(apyTotal0)} />
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
						layout={EntityLayout.Title}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							apyBase: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const apyBase = prefetched.apyBase}
					{#if apyBase !== undefined && apyBase !== null}
						<div>
							<dt>APY base</dt>
							<dd>
								<NumberValue value={Number(apyBase)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const apyBase = resolvedEntity.apyBase}
					{#if apyBase !== undefined && apyBase !== null}
						<div>
							<dt>APY base</dt>
							<dd>
								<NumberValue value={Number(apyBase)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							apyReward: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const apyReward = prefetched.apyReward}
					{#if apyReward !== undefined && apyReward !== null}
						<div>
							<dt>APY reward</dt>
							<dd>
								<NumberValue value={Number(apyReward)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const apyReward = resolvedEntity.apyReward}
					{#if apyReward !== undefined && apyReward !== null}
						<div>
							<dt>APY reward</dt>
							<dd>
								<NumberValue value={Number(apyReward)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							apyTotal: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const apyTotal = prefetched.apyTotal}
					{#if apyTotal !== undefined && apyTotal !== null}
						<div>
							<dt>APY total</dt>
							<dd>
								<NumberValue value={Number(apyTotal)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const apyTotal = resolvedEntity.apyTotal}
					{#if apyTotal !== undefined && apyTotal !== null}
						<div>
							<dt>APY total</dt>
							<dd>
								<NumberValue value={Number(apyTotal)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tvlUsd: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tvlUsd = prefetched.tvlUsd}
					{#if tvlUsd !== undefined && tvlUsd !== null}
						<div>
							<dt>TVL USD</dt>
							<dd>
								<NumberValue value={Number(tvlUsd)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tvlUsd = resolvedEntity.tvlUsd}
					{#if tvlUsd !== undefined && tvlUsd !== null}
						<div>
							<dt>TVL USD</dt>
							<dd>
								<NumberValue value={Number(tvlUsd)} />
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
							selection({
								fields: {
									rewardTokens: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rewardTokens = prefetched.rewardTokens}
							{#if rewardTokens !== undefined && rewardTokens !== null}
								{(rewardTokens?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rewardTokens = resolvedEntity.rewardTokens}
							{#if rewardTokens !== undefined && rewardTokens !== null}
								{(rewardTokens?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const poolId = prefetched.poolId}
					{#if poolId !== undefined && poolId !== null}
						<div>
							<dt>Pool ID</dt>
							<dd>
								{String((poolId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const poolId = resolvedEntity.poolId}
					{#if poolId !== undefined && poolId !== null}
						<div>
							<dt>Pool ID</dt>
							<dd>
								{String((poolId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							projectSlug: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const projectSlug = prefetched.projectSlug}
					{#if projectSlug !== undefined && projectSlug !== null}
						<div>
							<dt>Project slug</dt>
							<dd>
								{String((projectSlug) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const projectSlug = resolvedEntity.projectSlug}
					{#if projectSlug !== undefined && projectSlug !== null}
						<div>
							<dt>Project slug</dt>
							<dd>
								{String((projectSlug) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainLabel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainLabel = prefetched.chainLabel}
					{#if chainLabel !== undefined && chainLabel !== null}
						<div>
							<dt>Chain label</dt>
							<dd>
								{String((chainLabel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainLabel = resolvedEntity.chainLabel}
					{#if chainLabel !== undefined && chainLabel !== null}
						<div>
							<dt>Chain label</dt>
							<dd>
								{String((chainLabel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
