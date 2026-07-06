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
			selection: EntityProxyResource<typeof schema, EntityType.SuiObjectVersion>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiObjectVersion>>
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
	const suiObjectVersion = $derived(selection({}))
	const titleFallback = $derived('Sui object version')
	const viewDomId = $derived('sui-object-version-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiObjectVersion}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiObjectVersion}>
			{#snippet Pending()}
				{title || 'Sui object version'}
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
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>object ID</dt>
				<dd>
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
							{@const objectId = selection.entitySelector.objectId ?? prefetched.objectId}
							{#if objectId !== undefined && objectId !== null}
								{String((objectId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectId = resolvedEntity.objectId}
							{#if objectId !== undefined && objectId !== null}
								{String((objectId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
							{@const version = selection.entitySelector.version ?? prefetched.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const version = resolvedEntity.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
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
							{@const digest = selection.entitySelector.digest ?? prefetched.digest}
							{#if digest !== undefined && digest !== null}
								<TruncatedValue value={String((digest) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const digest = resolvedEntity.digest}
							{#if digest !== undefined && digest !== null}
								<TruncatedValue value={String((digest) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							previousTransaction: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const previousTransaction = prefetched.previousTransaction}
					{#if previousTransaction !== undefined && previousTransaction !== null}
						<div>
							<dt>previous transaction</dt>
							<dd>
								{String((previousTransaction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousTransaction = resolvedEntity.previousTransaction}
					{#if previousTransaction !== undefined && previousTransaction !== null}
						<div>
							<dt>previous transaction</dt>
							<dd>
								{String((previousTransaction) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storageRebate: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storageRebate = prefetched.storageRebate}
					{#if storageRebate !== undefined && storageRebate !== null}
						<div>
							<dt>storage rebate</dt>
							<dd>
								{String((storageRebate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storageRebate = resolvedEntity.storageRebate}
					{#if storageRebate !== undefined && storageRebate !== null}
						<div>
							<dt>storage rebate</dt>
							<dd>
								{String((storageRebate) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
