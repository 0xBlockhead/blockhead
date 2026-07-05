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
			selection: EntityProxyResource<typeof schema, EntityType.NearValidator>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearValidator>>
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
	const nearValidator = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			stakeYoctoNear: true,
			isSlashed: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.accountId ?? prefetched.accountId) ?? '')].filter(Boolean).join(' ') || 'near validator')
	const viewDomId = $derived('near-validator-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.NearValidator}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearValidator}>
			{#snippet Pending()}
				{[String((selection.entitySelector.accountId ?? prefetched.accountId) ?? '')].filter(Boolean).join(' ') || title || 'near validator'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.accountId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearValidator}>
			{#snippet Pending()}
				{@const stakeYoctoNear0 = prefetched.stakeYoctoNear}
				{#if stakeYoctoNear0 !== undefined && stakeYoctoNear0 !== null}
					<NumberValue value={Number(stakeYoctoNear0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const stakeYoctoNear0 = resolvedEntity.stakeYoctoNear}
				{#if stakeYoctoNear0 !== undefined && stakeYoctoNear0 !== null}
					<NumberValue value={Number(stakeYoctoNear0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearValidator}>
			{#snippet Pending()}
				{@const isSlashed0 = prefetched.isSlashed}
				{#if isSlashed0 !== undefined && isSlashed0 !== null}
					<span data-text="muted">
						{isSlashed0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const isSlashed0 = resolvedEntity.isSlashed}
				{#if isSlashed0 !== undefined && isSlashed0 !== null}
					<span data-text="muted">
						{isSlashed0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Account ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									accountId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const accountId = selection.entitySelector.accountId ?? prefetched.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const accountId = resolvedEntity.accountId}
							{#if accountId !== undefined && accountId !== null}
								<TruncatedValue value={String((accountId) ?? '')} />
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
							publicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publicKey = prefetched.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={String((publicKey) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey = resolvedEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={String((publicKey) ?? '')} />
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
							stakeYoctoNear: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeYoctoNear = prefetched.stakeYoctoNear}
					{#if stakeYoctoNear !== undefined && stakeYoctoNear !== null}
						<div>
							<dt>Stake yocto near</dt>
							<dd>
								<NumberValue value={Number(stakeYoctoNear)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeYoctoNear = resolvedEntity.stakeYoctoNear}
					{#if stakeYoctoNear !== undefined && stakeYoctoNear !== null}
						<div>
							<dt>Stake yocto near</dt>
							<dd>
								<NumberValue value={Number(stakeYoctoNear)} />
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
							isSlashed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isSlashed = prefetched.isSlashed}
					{#if isSlashed !== undefined && isSlashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{isSlashed ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isSlashed = resolvedEntity.isSlashed}
					{#if isSlashed !== undefined && isSlashed !== null}
						<div>
							<dt>Slashed</dt>
							<dd>
								{isSlashed ? 'Yes' : 'No'}
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
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							expectedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expectedBlocks = prefetched.expectedBlocks}
					{#if expectedBlocks !== undefined && expectedBlocks !== null}
						<div>
							<dt>Expected blocks</dt>
							<dd>
								<NumberValue value={Number(expectedBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expectedBlocks = resolvedEntity.expectedBlocks}
					{#if expectedBlocks !== undefined && expectedBlocks !== null}
						<div>
							<dt>Expected blocks</dt>
							<dd>
								<NumberValue value={Number(expectedBlocks)} />
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
							producedBlocks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const producedBlocks = prefetched.producedBlocks}
					{#if producedBlocks !== undefined && producedBlocks !== null}
						<div>
							<dt>Produced blocks</dt>
							<dd>
								<NumberValue value={Number(producedBlocks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const producedBlocks = resolvedEntity.producedBlocks}
					{#if producedBlocks !== undefined && producedBlocks !== null}
						<div>
							<dt>Produced blocks</dt>
							<dd>
								<NumberValue value={Number(producedBlocks)} />
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
							expectedChunks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expectedChunks = prefetched.expectedChunks}
					{#if expectedChunks !== undefined && expectedChunks !== null}
						<div>
							<dt>Expected chunks</dt>
							<dd>
								<NumberValue value={Number(expectedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expectedChunks = resolvedEntity.expectedChunks}
					{#if expectedChunks !== undefined && expectedChunks !== null}
						<div>
							<dt>Expected chunks</dt>
							<dd>
								<NumberValue value={Number(expectedChunks)} />
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
							producedChunks: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const producedChunks = prefetched.producedChunks}
					{#if producedChunks !== undefined && producedChunks !== null}
						<div>
							<dt>Produced chunks</dt>
							<dd>
								<NumberValue value={Number(producedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const producedChunks = resolvedEntity.producedChunks}
					{#if producedChunks !== undefined && producedChunks !== null}
						<div>
							<dt>Produced chunks</dt>
							<dd>
								<NumberValue value={Number(producedChunks)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
