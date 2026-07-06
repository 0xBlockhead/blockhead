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
			selection: EntityProxyResource<typeof schema, EntityType.SuiObjectChange>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiObjectChange>>
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
	const suiObjectChange = $derived(selection({}))
	const titleFallback = $derived('Sui object change')
	const viewDomId = $derived('sui-object-change-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiObjectChange}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiObjectChange}>
			{#snippet Pending()}
				{title || 'Sui object change'}
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
				<dt>transaction</dt>
				<dd>
					<SuiTransactionView
						selection={select(EntityType.SuiTransaction, selection.entitySelector.$transaction)}
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
								fields: {
									changeIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const changeIndex = selection.entitySelector.changeIndex ?? prefetched.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								{String((changeIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const changeIndex = resolvedEntity.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								{String((changeIndex) ?? '')}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							objectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const objectId = prefetched.objectId}
					{#if objectId !== undefined && objectId !== null}
						<div>
							<dt>object ID</dt>
							<dd>
								{String((objectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const objectId = resolvedEntity.objectId}
					{#if objectId !== undefined && objectId !== null}
						<div>
							<dt>object ID</dt>
							<dd>
								{String((objectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							objectType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const objectType = prefetched.objectType}
					{#if objectType !== undefined && objectType !== null}
						<div>
							<dt>object type</dt>
							<dd>
								{String((objectType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const objectType = resolvedEntity.objectType}
					{#if objectType !== undefined && objectType !== null}
						<div>
							<dt>object type</dt>
							<dd>
								{String((objectType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							digest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const digest = prefetched.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const digest = resolvedEntity.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
