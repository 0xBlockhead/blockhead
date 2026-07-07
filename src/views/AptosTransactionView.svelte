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
			selection: EntityProxyResource<typeof schema, EntityType.AptosTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosTransaction>>
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
	const aptosTransaction = $derived(selection({
		fields: {
			transactionKind: true,
			sender: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || [String((prefetched.version) ?? '')].filter(Boolean).join(' ') || 'aptos transaction')
	const viewDomId = $derived('aptos-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTransaction_TimestampsView from '$/views/AptosTransaction_TimestampsView.svelte'
	import AptosStateChangesView from '$/views/AptosStateChangesView.svelte'
	import AptosEventsView from '$/views/AptosEventsView.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet Pending()}
				{@const hash0 = prefetched.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const hash0 = resolvedEntity.hash}
				{#if hash0 !== undefined && hash0 !== null}
					<TruncatedValue value={String((hash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet Pending()}
				{[String((prefetched.transactionKind) ?? '')].filter(Boolean).join(' ') || [String((prefetched.hash) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.version) ?? '')].filter(Boolean).join(' ') || 'aptos transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.hash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosTransaction}>
			{#snippet Pending()}
				{@const sender0 = prefetched.sender}
				{#if sender0 !== undefined && sender0 !== null}
					<span data-text="muted">
						{String((sender0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const sender0 = resolvedEntity.sender}
				{#if sender0 !== undefined && sender0 !== null}
					<span data-text="muted">
						{String((sender0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									version: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const version = prefetched.version}
							{#if version !== undefined && version !== null}
								<NumberValue value={Number(version)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const version = resolvedEntity.version}
							{#if version !== undefined && version !== null}
								<NumberValue value={Number(version)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									hash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const hash = prefetched.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const hash = resolvedEntity.hash}
							{#if hash !== undefined && hash !== null}
								<TruncatedValue value={String((hash) ?? '')} />
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
							transactionKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionKind = prefetched.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionKind = resolvedEntity.transactionKind}
					{#if transactionKind !== undefined && transactionKind !== null}
						<div>
							<dt>transaction kind</dt>
							<dd>
								{String((transactionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sender: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sender = prefetched.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>sender</dt>
							<dd>
								{String((sender) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sender = resolvedEntity.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>sender</dt>
							<dd>
								{String((sender) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AptosTransaction_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AptosTransaction_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='AptosTransaction_TimestampsView-$$timestamps'
			/>

			<AptosStateChangesView
				selection={selection[EntityProxyField]<EntityType.AptosStateChange>('$$stateChanges')}
				title='state changes'
				emptyText='No state changes found.'
				id='AptosStateChangesView-$$stateChanges'
			/>

			<AptosEventsView
				selection={selection[EntityProxyField]<EntityType.AptosEvent>('$$events')}
				title='events'
				emptyText='No events found.'
				id='AptosEventsView-$$events'
			/>
		{/if}
	{/snippet}
</EntityView>
