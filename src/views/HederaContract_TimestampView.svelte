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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContract_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.HederaContract_Timestamp>>
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
	const hederaContractTimestamp = $derived(selection({}))
	const titleFallback = $derived('hedera contract timestamp')
	const viewDomId = $derived('hedera-contract-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContract_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hederaContractTimestamp}>
			{#snippet Pending()}
				{title || 'hedera contract timestamp'}
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
				<dt>contract</dt>
				<dd>
					<HederaContractView
						selection={select(EntityType.HederaContract, selection.entitySelector.$contract, {})}
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
							accountId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountId = prefetched.accountId}
					{#if accountId !== undefined && accountId !== null}
						<div>
							<dt>account ID</dt>
							<dd>
								<TruncatedValue value={String((accountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountId = resolvedEntity.accountId}
					{#if accountId !== undefined && accountId !== null}
						<div>
							<dt>account ID</dt>
							<dd>
								<TruncatedValue value={String((accountId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeBytecodeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeBytecodeHash = prefetched.runtimeBytecodeHash}
					{#if runtimeBytecodeHash !== undefined && runtimeBytecodeHash !== null}
						<div>
							<dt>runtime bytecode hash</dt>
							<dd>
								<TruncatedValue value={String((runtimeBytecodeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeBytecodeHash = resolvedEntity.runtimeBytecodeHash}
					{#if runtimeBytecodeHash !== undefined && runtimeBytecodeHash !== null}
						<div>
							<dt>runtime bytecode hash</dt>
							<dd>
								<TruncatedValue value={String((runtimeBytecodeHash) ?? '')} />
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
							obtainerId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const obtainerId = prefetched.obtainerId}
					{#if obtainerId !== undefined && obtainerId !== null}
						<div>
							<dt>obtainer ID</dt>
							<dd>
								{String((obtainerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const obtainerId = resolvedEntity.obtainerId}
					{#if obtainerId !== undefined && obtainerId !== null}
						<div>
							<dt>obtainer ID</dt>
							<dd>
								{String((obtainerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							expirationTimestamp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expirationTimestamp = prefetched.expirationTimestamp}
					{#if expirationTimestamp !== undefined && expirationTimestamp !== null}
						<div>
							<dt>expiration timestamp</dt>
							<dd>
								{String((expirationTimestamp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirationTimestamp = resolvedEntity.expirationTimestamp}
					{#if expirationTimestamp !== undefined && expirationTimestamp !== null}
						<div>
							<dt>expiration timestamp</dt>
							<dd>
								{String((expirationTimestamp) ?? '')}
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
					{@const autoRenewPeriodSeconds = prefetched.autoRenewPeriodSeconds}
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
		</dl>
	{/snippet}
</EntityView>
