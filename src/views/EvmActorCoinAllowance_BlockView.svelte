<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmActorCoinAllowance_Block>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmActorCoinAllowance_Block>>
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
		sources: selection.sources,
		fields: {
			allowance: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.blockNumber) ?? '') ? 'Block ' + String((pendingEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || 'EVM actor coin allowance block')
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[(String((pendingEntity.blockNumber) ?? '') ? 'Block ' + String((pendingEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[(String((resolvedEntity.blockNumber) ?? '') ? 'Block ' + String((resolvedEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.allowance) ?? '')].filter(Boolean).join(' ') || [(String((pendingEntity.blockNumber) ?? '') ? 'Block ' + String((pendingEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.allowance) ?? '')].filter(Boolean).join(' ') || [(String((resolvedEntity.blockNumber) ?? '') ? 'Block ' + String((resolvedEntity.blockNumber) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									blockNumber: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									allowance: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							blockTag: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							checkedAt: true,
						},
					})
				}
			>
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
						selection={select(EntityType.EvmActorCoinAllowance, selection.entitySelector.$allowance, {})}
						href={
							(selection.entitySelector.$allowance.$actor !== undefined && selection.entitySelector.$allowance.$actor.address !== undefined && selection.entitySelector.$allowance.$contract !== undefined && selection.entitySelector.$allowance.$contract.$network !== undefined && selection.entitySelector.$allowance.$contract.$network.caip2 !== undefined && selection.entitySelector.$allowance.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$allowance.$contract.address !== undefined && selection.entitySelector.$allowance.$spender !== undefined && selection.entitySelector.$allowance.$spender.address !== undefined ? resolve('/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]', {
								owner: String(selection.entitySelector.$allowance.$actor.address ?? ''),
								chainId: String(selection.entitySelector.$allowance.$contract.$network.caip2.reference ?? ''),
								coin: String(selection.entitySelector.$allowance.$contract.address ?? ''),
								spender: String(selection.entitySelector.$allowance.$spender.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
