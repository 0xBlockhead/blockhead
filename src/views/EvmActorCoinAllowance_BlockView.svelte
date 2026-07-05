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
			selection: EntityProxyResource<typeof schema, EntityType.EvmActorCoinAllowance_Block>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmActorCoinAllowance_Block>>
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
	const evmActorCoinAllowanceBlock = $derived(selection({
		fields: {
			allowance: true,
		},
	}))
	const titleFallback = $derived([(String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') ? 'Block ' + String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || 'EVM actor coin allowance block')
	const viewDomId = $derived('evm-actor-coin-allowance-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmActorCoinAllowance_Block}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
			{#snippet Pending()}
				{[(String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') ? 'Block ' + String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || title || 'EVM actor coin allowance block'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[(String((resolvedEntity.blockNumber) ?? '') ? 'Block ' + String((resolvedEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
			{#snippet Pending()}
				{[String((prefetched.allowance) ?? '')].filter(Boolean).join(' ') || [(String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') ? 'Block ' + String((selection.entitySelector.blockNumber ?? prefetched.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || title || 'EVM actor coin allowance block'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.allowance) ?? '')].filter(Boolean).join(' ') || [(String((resolvedEntity.blockNumber) ?? '') ? 'Block ' + String((resolvedEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockNumber: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockNumber = selection.entitySelector.blockNumber ?? prefetched.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockNumber = resolvedEntity.blockNumber}
							{#if blockNumber !== undefined && blockNumber !== null}
								{String((blockNumber) ?? '')}
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

			<div>
				<dt>Allowance</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									allowance: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const allowance = prefetched.allowance}
							{#if allowance !== undefined && allowance !== null}
								{String((allowance) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const allowance = resolvedEntity.allowance}
							{#if allowance !== undefined && allowance !== null}
								{String((allowance) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockTag: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockTag = prefetched.blockTag}
					{#if blockTag !== undefined && blockTag !== null}
						<div>
							<dt>Block tag</dt>
							<dd>
								{String((blockTag) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockTag = resolvedEntity.blockTag}
					{#if blockTag !== undefined && blockTag !== null}
						<div>
							<dt>Block tag</dt>
							<dd>
								{String((blockTag) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							checkedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const checkedAt = prefetched.checkedAt}
					{#if checkedAt !== undefined && checkedAt !== null}
						<div>
							<dt>Checked at</dt>
							<dd>
								<Timestamp timestamp={Number(checkedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const checkedAt = resolvedEntity.checkedAt}
					{#if checkedAt !== undefined && checkedAt !== null}
						<div>
							<dt>Checked at</dt>
							<dd>
								<Timestamp timestamp={Number(checkedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Allowance</dt>
				<dd>
					<EvmActorCoinAllowanceView
						selection={select(EntityType.EvmActorCoinAllowance, selection.entitySelector.$allowance)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
