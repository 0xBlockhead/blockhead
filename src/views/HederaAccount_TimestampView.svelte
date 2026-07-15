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
			selection: RegisteredEntityProxyResource<EntityType.HederaAccount_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.HederaAccount_Timestamp>>
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
	const hederaAccountTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera account timestamp')
	const viewDomId = $derived('hedera-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaAccountTimestamp}>
			{#snippet Pending()}
				{title || 'hedera account timestamp'}
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
					<HederaAccountView
						selection={select(EntityType.HederaAccount, selection.entitySelector.$account, {})}
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
							alias: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const alias = pendingEntity.alias}
					{#if alias !== undefined && alias !== null}
						<div>
							<dt>alias</dt>
							<dd>
								{String((alias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const alias = resolvedEntity.alias}
					{#if alias !== undefined && alias !== null}
						<div>
							<dt>alias</dt>
							<dd>
								{String((alias) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evmAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const evmAddress = pendingEntity.evmAddress}
					{#if evmAddress !== undefined && evmAddress !== null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={String((evmAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evmAddress = resolvedEntity.evmAddress}
					{#if evmAddress !== undefined && evmAddress !== null}
						<div>
							<dt>EVM address</dt>
							<dd>
								<TruncatedValue value={String((evmAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							receiverSigRequired: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receiverSigRequired = pendingEntity.receiverSigRequired}
					{#if receiverSigRequired !== undefined && receiverSigRequired !== null}
						<div>
							<dt>receiver sig required</dt>
							<dd>
								{receiverSigRequired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receiverSigRequired = resolvedEntity.receiverSigRequired}
					{#if receiverSigRequired !== undefined && receiverSigRequired !== null}
						<div>
							<dt>receiver sig required</dt>
							<dd>
								{receiverSigRequired ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const memo = pendingEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balanceTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceTinybar = pendingEntity.balanceTinybar}
					{#if balanceTinybar !== undefined && balanceTinybar !== null}
						<div>
							<dt>balance tinybar</dt>
							<dd>
								{String((balanceTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceTinybar = resolvedEntity.balanceTinybar}
					{#if balanceTinybar !== undefined && balanceTinybar !== null}
						<div>
							<dt>balance tinybar</dt>
							<dd>
								{String((balanceTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							deleted: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const deleted = pendingEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const deleted = resolvedEntity.deleted}
					{#if deleted !== undefined && deleted !== null}
						<div>
							<dt>deleted</dt>
							<dd>
								{deleted ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							autoRenewPeriodSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const autoRenewPeriodSeconds = pendingEntity.autoRenewPeriodSeconds}
					{#if autoRenewPeriodSeconds !== undefined && autoRenewPeriodSeconds !== null}
						<div>
							<dt>auto renew period seconds</dt>
							<dd>
								{String((autoRenewPeriodSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const autoRenewPeriodSeconds = resolvedEntity.autoRenewPeriodSeconds}
					{#if autoRenewPeriodSeconds !== undefined && autoRenewPeriodSeconds !== null}
						<div>
							<dt>auto renew period seconds</dt>
							<dd>
								{String((autoRenewPeriodSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expiryTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expiryTimestamp = pendingEntity.expiryTimestamp}
					{#if expiryTimestamp !== undefined && expiryTimestamp !== null}
						<div>
							<dt>expiry timestamp</dt>
							<dd>
								{String((expiryTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expiryTimestamp = resolvedEntity.expiryTimestamp}
					{#if expiryTimestamp !== undefined && expiryTimestamp !== null}
						<div>
							<dt>expiry timestamp</dt>
							<dd>
								{String((expiryTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakedNodeId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakedNodeId = pendingEntity.stakedNodeId}
					{#if stakedNodeId !== undefined && stakedNodeId !== null}
						<div>
							<dt>staked node ID</dt>
							<dd>
								{String((stakedNodeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakedNodeId = resolvedEntity.stakedNodeId}
					{#if stakedNodeId !== undefined && stakedNodeId !== null}
						<div>
							<dt>staked node ID</dt>
							<dd>
								{String((stakedNodeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakedAccountId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakedAccountId = pendingEntity.stakedAccountId}
					{#if stakedAccountId !== undefined && stakedAccountId !== null}
						<div>
							<dt>staked account ID</dt>
							<dd>
								<TruncatedValue value={String((stakedAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakedAccountId = resolvedEntity.stakedAccountId}
					{#if stakedAccountId !== undefined && stakedAccountId !== null}
						<div>
							<dt>staked account ID</dt>
							<dd>
								<TruncatedValue value={String((stakedAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							declineReward: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const declineReward = pendingEntity.declineReward}
					{#if declineReward !== undefined && declineReward !== null}
						<div>
							<dt>decline reward</dt>
							<dd>
								{declineReward ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declineReward = resolvedEntity.declineReward}
					{#if declineReward !== undefined && declineReward !== null}
						<div>
							<dt>decline reward</dt>
							<dd>
								{declineReward ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pendingRewardTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const pendingRewardTinybar = pendingEntity.pendingRewardTinybar}
					{#if pendingRewardTinybar !== undefined && pendingRewardTinybar !== null}
						<div>
							<dt>pending reward tinybar</dt>
							<dd>
								{String((pendingRewardTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingRewardTinybar = resolvedEntity.pendingRewardTinybar}
					{#if pendingRewardTinybar !== undefined && pendingRewardTinybar !== null}
						<div>
							<dt>pending reward tinybar</dt>
							<dd>
								{String((pendingRewardTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
