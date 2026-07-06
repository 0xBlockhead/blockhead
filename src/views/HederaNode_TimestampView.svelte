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
			selection: EntityProxyResource<typeof schema, EntityType.HederaNode_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaNode_Timestamp>>
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
	const hederaNodeTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera node timestamp')
	const viewDomId = $derived('hedera-node-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaNodeView from '$/views/HederaNodeView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaNode_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaNodeTimestamp}>
			{#snippet Pending()}
				{title || 'hedera node timestamp'}
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
				<dt>node</dt>
				<dd>
					<HederaNodeView
						selection={select(EntityType.HederaNode, selection.entitySelector.$node)}
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
							nodeAccountId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeAccountId = prefetched.nodeAccountId}
					{#if nodeAccountId !== undefined && nodeAccountId !== null}
						<div>
							<dt>node account ID</dt>
							<dd>
								<TruncatedValue value={String((nodeAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeAccountId = resolvedEntity.nodeAccountId}
					{#if nodeAccountId !== undefined && nodeAccountId !== null}
						<div>
							<dt>node account ID</dt>
							<dd>
								<TruncatedValue value={String((nodeAccountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.HederaAccount, false>('$account')}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null && hederaAccount[EntityMetaKey.Selector] != null}
						<div>
							<dt>account</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, hederaAccount[EntityMetaKey.Selector])}
									prefetched={hederaAccount}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fileId = prefetched.fileId}
					{#if fileId !== undefined && fileId !== null}
						<div>
							<dt>file ID</dt>
							<dd>
								{String((fileId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fileId = resolvedEntity.fileId}
					{#if fileId !== undefined && fileId !== null}
						<div>
							<dt>file ID</dt>
							<dd>
								{String((fileId) ?? '')}
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
					{@const memo = prefetched.memo}
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
							publicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publicKey = prefetched.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey = resolvedEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeCertHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeCertHash = prefetched.nodeCertHash}
					{#if nodeCertHash !== undefined && nodeCertHash !== null}
						<div>
							<dt>node cert hash</dt>
							<dd>
								<TruncatedValue value={String((nodeCertHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeCertHash = resolvedEntity.nodeCertHash}
					{#if nodeCertHash !== undefined && nodeCertHash !== null}
						<div>
							<dt>node cert hash</dt>
							<dd>
								<TruncatedValue value={String((nodeCertHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeTinybar = prefetched.stakeTinybar}
					{#if stakeTinybar !== undefined && stakeTinybar !== null}
						<div>
							<dt>stake tinybar</dt>
							<dd>
								{String((stakeTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeTinybar = resolvedEntity.stakeTinybar}
					{#if stakeTinybar !== undefined && stakeTinybar !== null}
						<div>
							<dt>stake tinybar</dt>
							<dd>
								{String((stakeTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeRewardedTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeRewardedTinybar = prefetched.stakeRewardedTinybar}
					{#if stakeRewardedTinybar !== undefined && stakeRewardedTinybar !== null}
						<div>
							<dt>stake rewarded tinybar</dt>
							<dd>
								{String((stakeRewardedTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeRewardedTinybar = resolvedEntity.stakeRewardedTinybar}
					{#if stakeRewardedTinybar !== undefined && stakeRewardedTinybar !== null}
						<div>
							<dt>stake rewarded tinybar</dt>
							<dd>
								{String((stakeRewardedTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stakeNotRewardedTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeNotRewardedTinybar = prefetched.stakeNotRewardedTinybar}
					{#if stakeNotRewardedTinybar !== undefined && stakeNotRewardedTinybar !== null}
						<div>
							<dt>stake not rewarded tinybar</dt>
							<dd>
								{String((stakeNotRewardedTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeNotRewardedTinybar = resolvedEntity.stakeNotRewardedTinybar}
					{#if stakeNotRewardedTinybar !== undefined && stakeNotRewardedTinybar !== null}
						<div>
							<dt>stake not rewarded tinybar</dt>
							<dd>
								{String((stakeNotRewardedTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minStakeTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const minStakeTinybar = prefetched.minStakeTinybar}
					{#if minStakeTinybar !== undefined && minStakeTinybar !== null}
						<div>
							<dt>min stake tinybar</dt>
							<dd>
								{String((minStakeTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minStakeTinybar = resolvedEntity.minStakeTinybar}
					{#if minStakeTinybar !== undefined && minStakeTinybar !== null}
						<div>
							<dt>min stake tinybar</dt>
							<dd>
								{String((minStakeTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxStakeTinybar: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const maxStakeTinybar = prefetched.maxStakeTinybar}
					{#if maxStakeTinybar !== undefined && maxStakeTinybar !== null}
						<div>
							<dt>max stake tinybar</dt>
							<dd>
								{String((maxStakeTinybar) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const maxStakeTinybar = resolvedEntity.maxStakeTinybar}
					{#if maxStakeTinybar !== undefined && maxStakeTinybar !== null}
						<div>
							<dt>max stake tinybar</dt>
							<dd>
								{String((maxStakeTinybar) ?? '')}
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
					{@const deleted = prefetched.deleted}
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
		</dl>
	{/snippet}
</EntityView>
