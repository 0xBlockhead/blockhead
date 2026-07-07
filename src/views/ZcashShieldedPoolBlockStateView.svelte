<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedPoolBlockState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZcashShieldedPoolBlockState>>
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
	const zcashShieldedPoolBlockState = $derived(selection({
		fields: {
			finalRoot: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.pool ?? prefetched.pool) ?? '')].filter(Boolean).join(' ') || 'zcash shielded pool block state')
	const viewDomId = $derived('zcash-shielded-pool-block-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPoolBlockState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zcashShieldedPoolBlockState}>
			{#snippet Pending()}
				{[String((selection.entitySelector.pool ?? prefetched.pool) ?? '')].filter(Boolean).join(' ') || title || 'zcash shielded pool block state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zcashShieldedPoolBlockState}>
			{#snippet Pending()}
				{@const finalRoot0 = prefetched.finalRoot}
				{#if finalRoot0 !== undefined && finalRoot0 !== null}
					<TruncatedValue value={String((finalRoot0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const finalRoot0 = resolvedEntity.finalRoot}
				{#if finalRoot0 !== undefined && finalRoot0 !== null}
					<TruncatedValue value={String((finalRoot0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block, {})}
						href={
							(selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.namespace !== undefined && selection.entitySelector.$block.$network !== undefined && selection.entitySelector.$block.$network.caip2 !== undefined && selection.entitySelector.$block.$network.caip2.reference !== undefined && selection.entitySelector.$block.height !== undefined && selection.entitySelector.$block.hash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/block/[height=nonNegativeInteger]/[hash]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$block.$network.caip2.namespace) + ':' + String(selection.entitySelector.$block.$network.caip2.reference))].slug ?? ''),
								height: String(selection.entitySelector.$block.height ?? ''),
								hash: String(selection.entitySelector.$block.hash ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>pool</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									pool: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pool = selection.entitySelector.pool ?? prefetched.pool}
							{#if pool !== undefined && pool !== null}
								{String((pool) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pool = resolvedEntity.pool}
							{#if pool !== undefined && pool !== null}
								{String((pool) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finalRoot: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const finalRoot = prefetched.finalRoot}
					{#if finalRoot !== undefined && finalRoot !== null}
						<div>
							<dt>final root</dt>
							<dd>
								{String((finalRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const finalRoot = resolvedEntity.finalRoot}
					{#if finalRoot !== undefined && finalRoot !== null}
						<div>
							<dt>final root</dt>
							<dd>
								{String((finalRoot) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockCommitments: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockCommitments = prefetched.blockCommitments}
					{#if blockCommitments !== undefined && blockCommitments !== null}
						<div>
							<dt>block commitments</dt>
							<dd>
								{String((blockCommitments) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockCommitments = resolvedEntity.blockCommitments}
					{#if blockCommitments !== undefined && blockCommitments !== null}
						<div>
							<dt>block commitments</dt>
							<dd>
								{String((blockCommitments) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
