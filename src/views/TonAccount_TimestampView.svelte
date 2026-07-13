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
			selection: EntityProxyResource<typeof schema, EntityType.TonAccount_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonAccount_Timestamp>>
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
	const tonAccountTimestamp = $derived(selection({}))
	const titleFallback = $derived('TON account timestamp')
	const viewDomId = $derived('ton-account-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonAccountView from '$/views/TonAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.TonAccount_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonAccountTimestamp}>
			{#snippet Pending()}
				{title || 'TON account timestamp'}
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
					<TonAccountView
						selection={select(EntityType.TonAccount, selection.entitySelector.$account, {})}
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
							balanceNano: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceNano = pendingEntity.balanceNano}
					{#if balanceNano !== undefined && balanceNano !== null}
						<div>
							<dt>balance nano</dt>
							<dd>
								{String((balanceNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceNano = resolvedEntity.balanceNano}
					{#if balanceNano !== undefined && balanceNano !== null}
						<div>
							<dt>balance nano</dt>
							<dd>
								{String((balanceNano) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = pendingEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const codeHash = pendingEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codeHash = resolvedEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							dataHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const dataHash = pendingEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const dataHash = resolvedEntity.dataHash}
					{#if dataHash !== undefined && dataHash !== null}
						<div>
							<dt>data hash</dt>
							<dd>
								<TruncatedValue value={String((dataHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateHash = pendingEntity.stateHash}
					{#if stateHash !== undefined && stateHash !== null}
						<div>
							<dt>state hash</dt>
							<dd>
								<TruncatedValue value={String((stateHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateHash = resolvedEntity.stateHash}
					{#if stateHash !== undefined && stateHash !== null}
						<div>
							<dt>state hash</dt>
							<dd>
								<TruncatedValue value={String((stateHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							frozenHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const frozenHash = pendingEntity.frozenHash}
					{#if frozenHash !== undefined && frozenHash !== null}
						<div>
							<dt>frozen hash</dt>
							<dd>
								<TruncatedValue value={String((frozenHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const frozenHash = resolvedEntity.frozenHash}
					{#if frozenHash !== undefined && frozenHash !== null}
						<div>
							<dt>frozen hash</dt>
							<dd>
								<TruncatedValue value={String((frozenHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTransactionLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastTransactionLt = pendingEntity.lastTransactionLt}
					{#if lastTransactionLt !== undefined && lastTransactionLt !== null}
						<div>
							<dt>last transaction lt</dt>
							<dd>
								{String((lastTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastTransactionLt = resolvedEntity.lastTransactionLt}
					{#if lastTransactionLt !== undefined && lastTransactionLt !== null}
						<div>
							<dt>last transaction lt</dt>
							<dd>
								{String((lastTransactionLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastTransactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastTransactionHash = pendingEntity.lastTransactionHash}
					{#if lastTransactionHash !== undefined && lastTransactionHash !== null}
						<div>
							<dt>last transaction hash</dt>
							<dd>
								<TruncatedValue value={String((lastTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastTransactionHash = resolvedEntity.lastTransactionHash}
					{#if lastTransactionHash !== undefined && lastTransactionHash !== null}
						<div>
							<dt>last transaction hash</dt>
							<dd>
								<TruncatedValue value={String((lastTransactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
