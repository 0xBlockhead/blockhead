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
			selection: EntityProxyResource<typeof schema, EntityType.AptosStateChange>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AptosStateChange>>
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
	const aptosStateChange = $derived(selection({
		fields: {
			changeKind: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.changeKind) ?? '')].filter(Boolean).join(' ') || 'aptos state change')
	const viewDomId = $derived('aptos-state-change-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
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
		<ResourceBoundary resource={aptosStateChange}>
			{#snippet Pending()}
				{[String((prefetched.changeKind) ?? '')].filter(Boolean).join(' ') || title || 'aptos state change'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.changeKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosStateChange}>
			{#snippet Pending()}
				{@const changeIndex0 = selection.entitySelector.changeIndex ?? prefetched.changeIndex}
				{#if changeIndex0 !== undefined && changeIndex0 !== null}
					<NumberValue value={Number(changeIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const changeIndex0 = resolvedEntity.changeIndex}
				{#if changeIndex0 !== undefined && changeIndex0 !== null}
					<NumberValue value={Number(changeIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aptosStateChange}>
			{#snippet Pending()}
				<span data-text="muted">
					<AptosTransactionView
						selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<AptosTransactionView
						selection={select(EntityType.AptosTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
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
								fields: {
									changeIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const changeIndex = selection.entitySelector.changeIndex ?? prefetched.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								<NumberValue value={Number(changeIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const changeIndex = resolvedEntity.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								<NumberValue value={Number(changeIndex)} />
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
								fields: {
									changeKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const changeKind = prefetched.changeKind}
							{#if changeKind !== undefined && changeKind !== null}
								{String((changeKind) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							address: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const address = prefetched.address}
					{#if address !== undefined && address !== null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue value={String((address) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							stateKeyHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateKeyHash = prefetched.stateKeyHash}
					{#if stateKeyHash !== undefined && stateKeyHash !== null}
						<div>
							<dt>state key hash</dt>
							<dd>
								<TruncatedValue value={String((stateKeyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							resourceType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resourceType = prefetched.resourceType}
					{#if resourceType !== undefined && resourceType !== null}
						<div>
							<dt>resource type</dt>
							<dd>
								{String((resourceType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.AptosAccountResource, false>('$resource')}
			>
				{#snippet children(aptosAccountResource)}
					{#if aptosAccountResource != null && aptosAccountResource[EntityMetaKey.Selector] != null}
						<div>
							<dt>resource</dt>
							<dd>
								<AptosAccountResourceView
									selection={select(EntityType.AptosAccountResource, aptosAccountResource[EntityMetaKey.Selector])}
									prefetched={aptosAccountResource}
									layout={EntityLayout.Title}
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
						fields: {
							moduleAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moduleAddress = prefetched.moduleAddress}
					{#if moduleAddress !== undefined && moduleAddress !== null}
						<div>
							<dt>module address</dt>
							<dd>
								<TruncatedValue value={String((moduleAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							moduleName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moduleName = prefetched.moduleName}
					{#if moduleName !== undefined && moduleName !== null}
						<div>
							<dt>module name</dt>
							<dd>
								{String((moduleName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				resource={selection[EntityProxyField]<EntityType.MoveModule, false>('$module')}
			>
				{#snippet children(moveModule)}
					{#if moveModule != null && moveModule[EntityMetaKey.Selector] != null}
						<div>
							<dt>module</dt>
							<dd>
								<MoveModuleView
									selection={select(EntityType.MoveModule, moveModule[EntityMetaKey.Selector])}
									prefetched={moveModule}
									layout={EntityLayout.Title}
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
