<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidValidator_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HyperliquidValidator_Timestamp>>
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
	const hyperliquidValidatorTimestamp = $derived(selection({}))
	const titleFallback = $derived('hyperliquid validator timestamp')
	const viewDomId = $derived('hyperliquid-validator-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HyperliquidValidatorView from '$/views/HyperliquidValidatorView.svelte'
	import HyperliquidAccountView from '$/views/HyperliquidAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidValidator_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidValidatorTimestamp}>
			{#snippet Pending()}
				{title || 'hyperliquid validator timestamp'}
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
				<dt>validator</dt>
				<dd>
					<HyperliquidValidatorView
						selection={select(EntityType.HyperliquidValidator, selection.entitySelector.$validator)}
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
							commission: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commission = prefetched.commission}
					{#if commission !== undefined && commission !== null}
						<div>
							<dt>commission</dt>
							<dd>
								{String((commission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commission = resolvedEntity.commission}
					{#if commission !== undefined && commission !== null}
						<div>
							<dt>commission</dt>
							<dd>
								{String((commission) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							recentBlockCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const recentBlockCount = prefetched.recentBlockCount}
					{#if recentBlockCount !== undefined && recentBlockCount !== null}
						<div>
							<dt>recent block count</dt>
							<dd>
								{String((recentBlockCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recentBlockCount = resolvedEntity.recentBlockCount}
					{#if recentBlockCount !== undefined && recentBlockCount !== null}
						<div>
							<dt>recent block count</dt>
							<dd>
								{String((recentBlockCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isActive: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isActive = prefetched.isActive}
					{#if isActive !== undefined && isActive !== null}
						<div>
							<dt>is active</dt>
							<dd>
								{String((isActive) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isActive = resolvedEntity.isActive}
					{#if isActive !== undefined && isActive !== null}
						<div>
							<dt>is active</dt>
							<dd>
								{String((isActive) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stake: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stake = prefetched.stake}
					{#if stake !== undefined && stake !== null}
						<div>
							<dt>stake</dt>
							<dd>
								{String((stake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stake = resolvedEntity.stake}
					{#if stake !== undefined && stake !== null}
						<div>
							<dt>stake</dt>
							<dd>
								{String((stake) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isJailed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isJailed = prefetched.isJailed}
					{#if isJailed !== undefined && isJailed !== null}
						<div>
							<dt>is jailed</dt>
							<dd>
								{String((isJailed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isJailed = resolvedEntity.isJailed}
					{#if isJailed !== undefined && isJailed !== null}
						<div>
							<dt>is jailed</dt>
							<dd>
								{String((isJailed) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signerAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signerAddress = prefetched.signerAddress}
					{#if signerAddress !== undefined && signerAddress !== null}
						<div>
							<dt>signer address</dt>
							<dd>
								<TruncatedValue value={String((signerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signerAddress = resolvedEntity.signerAddress}
					{#if signerAddress !== undefined && signerAddress !== null}
						<div>
							<dt>signer address</dt>
							<dd>
								<TruncatedValue value={String((signerAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HyperliquidAccount, false>('$signer')}
			>
				{#snippet children(hyperliquidAccount)}
					{#if hyperliquidAccount != null && hyperliquidAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>signer</dt>
							<dd>
								<HyperliquidAccountView
									selection={select(EntityType.HyperliquidAccount, hyperliquidAccount[EntityMetaKey.Selector])}
									prefetched={hyperliquidAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const name = prefetched.name}
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
					{@const description = prefetched.description}
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
		</dl>
	{/snippet}
</EntityView>
