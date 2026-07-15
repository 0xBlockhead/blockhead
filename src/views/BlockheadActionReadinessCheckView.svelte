<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadActionReadinessCheck>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadActionReadinessCheck>>
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
	const blockheadActionReadinessCheck = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			checkKind: true,
			createdAt: true,
			capabilityKey: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.checkKind) ?? '')].filter(Boolean).join(' ') || 'blockhead action readiness check')
	const viewDomId = $derived('blockhead-action-readiness-check-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadActionReadinessCheck_TimestampsView from '$/views/BlockheadActionReadinessCheck_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadActionReadinessCheck}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadActionReadinessCheck}>
			{#snippet Pending()}
				{[String((pendingEntity.checkKind) ?? '')].filter(Boolean).join(' ') || title || 'blockhead action readiness check'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.checkKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadActionReadinessCheck}>
			{#snippet Pending()}
				{[String((pendingEntity.capabilityKey) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.checkKind) ?? '')].filter(Boolean).join(' ') || title || 'blockhead action readiness check'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.capabilityKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.checkKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadActionReadinessCheck}>
			{#snippet Pending()}
				{@const createdAt0 = pendingEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$sessionAction}
					>
						{#snippet children(blockheadSessionAction)}
							{#if blockheadSessionAction != null && blockheadSessionAction[EntityMetaKey.Selector] != null}
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>check ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									checkId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const checkId = pendingEntity.checkId}
							{#if checkId !== undefined && checkId !== null}
								{String((checkId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const checkId = resolvedEntity.checkId}
							{#if checkId !== undefined && checkId !== null}
								{String((checkId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>check kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									checkKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const checkKind = pendingEntity.checkKind}
							{#if checkKind !== undefined && checkKind !== null}
								{String((checkKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const checkKind = resolvedEntity.checkKind}
							{#if checkKind !== undefined && checkKind !== null}
								{String((checkKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							networkCaip2: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const networkCaip2 = pendingEntity.networkCaip2}
					{#if networkCaip2 !== undefined && networkCaip2 !== null}
						<div>
							<dt>network CAIP-2</dt>
							<dd>
								<TruncatedValue value={networkCaip2 == null ? '' : String((`${(networkCaip2).namespace}:${(networkCaip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const networkCaip2 = resolvedEntity.networkCaip2}
					{#if networkCaip2 !== undefined && networkCaip2 !== null}
						<div>
							<dt>network CAIP-2</dt>
							<dd>
								<TruncatedValue value={networkCaip2 == null ? '' : String((`${(networkCaip2).namespace}:${(networkCaip2).reference}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountCaip10: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountCaip10 = pendingEntity.accountCaip10}
					{#if accountCaip10 !== undefined && accountCaip10 !== null}
						<div>
							<dt>account CAIP-10</dt>
							<dd>
								<TruncatedValue value={accountCaip10 == null ? '' : String((`${(accountCaip10).namespace}:${(accountCaip10).reference}:${(accountCaip10).accountAddress}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountCaip10 = resolvedEntity.accountCaip10}
					{#if accountCaip10 !== undefined && accountCaip10 !== null}
						<div>
							<dt>account CAIP-10</dt>
							<dd>
								<TruncatedValue value={accountCaip10 == null ? '' : String((`${(accountCaip10).namespace}:${(accountCaip10).reference}:${(accountCaip10).accountAddress}`) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							assetCaip19: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const assetCaip19 = pendingEntity.assetCaip19}
					{#if assetCaip19 !== undefined && assetCaip19 !== null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{String((assetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const assetCaip19 = resolvedEntity.assetCaip19}
					{#if assetCaip19 !== undefined && assetCaip19 !== null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{String((assetCaip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainId = pendingEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainId = resolvedEntity.chainId}
					{#if chainId !== undefined && chainId !== null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue value={Number(chainId)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountAddress = pendingEntity.accountAddress}
					{#if accountAddress !== undefined && accountAddress !== null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={String((accountAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountAddress = resolvedEntity.accountAddress}
					{#if accountAddress !== undefined && accountAddress !== null}
						<div>
							<dt>account address</dt>
							<dd>
								<TruncatedValue value={String((accountAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tokenAddress = pendingEntity.tokenAddress}
					{#if tokenAddress !== undefined && tokenAddress !== null}
						<div>
							<dt>token address</dt>
							<dd>
								<TruncatedValue value={String((tokenAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenAddress = resolvedEntity.tokenAddress}
					{#if tokenAddress !== undefined && tokenAddress !== null}
						<div>
							<dt>token address</dt>
							<dd>
								<TruncatedValue value={String((tokenAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spenderAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spenderAddress = pendingEntity.spenderAddress}
					{#if spenderAddress !== undefined && spenderAddress !== null}
						<div>
							<dt>spender address</dt>
							<dd>
								<TruncatedValue value={String((spenderAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spenderAddress = resolvedEntity.spenderAddress}
					{#if spenderAddress !== undefined && spenderAddress !== null}
						<div>
							<dt>spender address</dt>
							<dd>
								<TruncatedValue value={String((spenderAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							capabilityKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const capabilityKey = pendingEntity.capabilityKey}
					{#if capabilityKey !== undefined && capabilityKey !== null}
						<div>
							<dt>capability key</dt>
							<dd>
								{String((capabilityKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const capabilityKey = resolvedEntity.capabilityKey}
					{#if capabilityKey !== undefined && capabilityKey !== null}
						<div>
							<dt>capability key</dt>
							<dd>
								{String((capabilityKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requiredAmount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requiredAmount = pendingEntity.requiredAmount}
					{#if requiredAmount !== undefined && requiredAmount !== null}
						<div>
							<dt>required amount</dt>
							<dd>
								<NumberValue value={Number(requiredAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requiredAmount = resolvedEntity.requiredAmount}
					{#if requiredAmount !== undefined && requiredAmount !== null}
						<div>
							<dt>required amount</dt>
							<dd>
								<NumberValue value={Number(requiredAmount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = pendingEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadActionReadinessCheck_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No readiness observations.'
				id='BlockheadActionReadinessCheck_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
