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
			selection: EntityProxyResource<typeof schema, EntityType.NearAction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearAction>>
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
	const nearAction = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			actionKind: true,
			methodName: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.actionKind) ?? '')].filter(Boolean).join(' ') || 'near action')
	const viewDomId = $derived('near-action-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearAction}>
			{#snippet Pending()}
				{[String((prefetched.actionKind) ?? '')].filter(Boolean).join(' ') || title || 'near action'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.actionKind) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAction}>
			{#snippet Pending()}
				{[String((prefetched.methodName) ?? '')].filter(Boolean).join(' ') || [String((prefetched.actionKind) ?? '')].filter(Boolean).join(' ') || title || 'near action'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.methodName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.actionKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearAction}>
			{#snippet Pending()}
				{@const actionIndex0 = selection.entitySelector.actionIndex ?? prefetched.actionIndex}
				{#if actionIndex0 !== undefined && actionIndex0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(actionIndex0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const actionIndex0 = resolvedEntity.actionIndex}
				{#if actionIndex0 !== undefined && actionIndex0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(actionIndex0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<NearTransactionView
						selection={select(EntityType.NearTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Action index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									actionIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const actionIndex = selection.entitySelector.actionIndex ?? prefetched.actionIndex}
							{#if actionIndex !== undefined && actionIndex !== null}
								<NumberValue value={Number(actionIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const actionIndex = resolvedEntity.actionIndex}
							{#if actionIndex !== undefined && actionIndex !== null}
								<NumberValue value={Number(actionIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Action kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.NearRpc_JsonRpc,
								],
								fields: {
									actionKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const actionKind = prefetched.actionKind}
							{#if actionKind !== undefined && actionKind !== null}
								{String((actionKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const actionKind = resolvedEntity.actionKind}
							{#if actionKind !== undefined && actionKind !== null}
								{String((actionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							methodName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const methodName = prefetched.methodName}
					{#if methodName !== undefined && methodName !== null}
						<div>
							<dt>Method name</dt>
							<dd>
								{String((methodName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const methodName = resolvedEntity.methodName}
					{#if methodName !== undefined && methodName !== null}
						<div>
							<dt>Method name</dt>
							<dd>
								{String((methodName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							depositYoctoNear: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const depositYoctoNear = prefetched.depositYoctoNear}
					{#if depositYoctoNear !== undefined && depositYoctoNear !== null}
						<div>
							<dt>Deposit yocto near</dt>
							<dd>
								<NumberValue value={Number(depositYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const depositYoctoNear = resolvedEntity.depositYoctoNear}
					{#if depositYoctoNear !== undefined && depositYoctoNear !== null}
						<div>
							<dt>Deposit yocto near</dt>
							<dd>
								<NumberValue value={Number(depositYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
