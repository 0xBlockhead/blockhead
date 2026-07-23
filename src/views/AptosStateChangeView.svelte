<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.AptosStateChange>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AptosStateChange>
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
	const aptosStateChange = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			changeKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			changeKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.changeKind) ?? '')].filter(Boolean).join(' ') || 'aptos state change')
	const viewDomId = $derived('aptos-state-change-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosTransactionView from '$/views/AptosTransactionView.svelte'
	import AptosAccountResourceView from '$/views/AptosAccountResourceView.svelte'
	import MoveModuleView from '$/views/MoveModuleView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosStateChange}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'changeKind') && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, 'hash') && Object.hasOwn(prefetched.$transaction, 'transactionKind') && Object.hasOwn(prefetched.$transaction, 'version') && Object.hasOwn(prefetched.$transaction, 'sender')}
			{[String((pendingEntity.changeKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aptosStateChange}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.changeKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'changeKind') && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, 'hash') && Object.hasOwn(prefetched.$transaction, 'transactionKind') && Object.hasOwn(prefetched.$transaction, 'version') && Object.hasOwn(prefetched.$transaction, 'sender')}
			{@const changeIndex0 = pendingEntity.changeIndex}
			{#if changeIndex0 !== undefined && changeIndex0 !== null}
				<NumberValue
					value={changeIndex0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={aptosStateChange}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const changeIndex0 = resolvedEntity.changeIndex}
					{#if changeIndex0 !== undefined && changeIndex0 !== null}
						<NumberValue
							value={changeIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'changeKind') && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, 'hash') && Object.hasOwn(prefetched.$transaction, 'transactionKind') && Object.hasOwn(prefetched.$transaction, 'version') && Object.hasOwn(prefetched.$transaction, 'sender')}
			<span data-text="muted">
				<AptosTransactionView
					selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={aptosStateChange}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<span data-text="muted">
						<AptosTransactionView
							selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<AptosTransactionView
						selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>change index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									changeIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const changeIndex = resolvedEntity.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								<NumberValue
									value={changeIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>change kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									changeKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const changeKind = resolvedEntity.changeKind}
							{#if changeKind !== undefined && changeKind !== null}
								{String((changeKind) ?? '')}
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
						sources: selection.sources,
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const address = resolvedEntity.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							stateKeyHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateKeyHash = resolvedEntity.stateKeyHash}
					{#if stateKeyHash !== undefined && stateKeyHash !== null}
						<div>
							<dt>state key hash</dt>
							<dd>
								<TruncatedValue value={String((stateKeyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							resourceType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resourceType = resolvedEntity.resourceType}
					{#if resourceType !== undefined && resourceType !== null}
						<div>
							<dt>resource type</dt>
							<dd>
								{String((resourceType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$resource}
			>
				{#snippet children(aptosAccountResource)}
					{#if aptosAccountResource != null && aptosAccountResource[EntityMetaKey.Selector] != null}
						<div>
							<dt>resource</dt>
							<dd>
								<AptosAccountResourceView
									selection={select(EntityType.AptosAccountResource, aptosAccountResource[EntityMetaKey.Selector])}
									prefetched={aptosAccountResource}
									layout={EntityLayout.Value}
									open={false}
								/>
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
						sources: selection.sources,
						fields: {
							moduleAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleAddress = resolvedEntity.moduleAddress}
					{#if moduleAddress !== undefined && moduleAddress !== null}
						<div>
							<dt>module address</dt>
							<dd>
								<TruncatedValue value={String((moduleAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							moduleName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleName = resolvedEntity.moduleName}
					{#if moduleName !== undefined && moduleName !== null}
						<div>
							<dt>module name</dt>
							<dd>
								{String((moduleName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$module}
			>
				{#snippet children(moveModule)}
					{#if moveModule != null && moveModule[EntityMetaKey.Selector] != null}
						<div>
							<dt>module</dt>
							<dd>
								<MoveModuleView
									selection={select(EntityType.MoveModule, moveModule[EntityMetaKey.Selector])}
									prefetched={moveModule}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
