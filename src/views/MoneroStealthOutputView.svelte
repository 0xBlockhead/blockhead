<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
			selection: RegisteredEntityProxyResource<EntityType.MoneroStealthOutput>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.MoneroStealthOutput>>
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
	const moneroStealthOutput = $derived(selection({
		sources: selection.sources,
		fields: {
			publicKey: true,
			commitment: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.outputIndex) ?? '')].filter(Boolean).join(' ') || 'monero stealth output')
	const viewDomId = $derived('monero-stealth-output-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroStealthOutput}
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
					{@const outputIndex0 = pendingEntity.outputIndex}
					{#if outputIndex0 !== undefined && outputIndex0 !== null}
						<NumberValue
							value={outputIndex0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={moneroStealthOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const outputIndex0 = resolvedEntity.outputIndex}
					{#if outputIndex0 !== undefined && outputIndex0 !== null}
						<NumberValue
							value={outputIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const publicKey0 = pendingEntity.publicKey}
					{#if publicKey0 !== undefined && publicKey0 !== null}
						<TruncatedValue value={String((publicKey0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={moneroStealthOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey0 = resolvedEntity.publicKey}
					{#if publicKey0 !== undefined && publicKey0 !== null}
						<TruncatedValue value={String((publicKey0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const commitment0 = pendingEntity.commitment}
			{#if commitment0 !== undefined && commitment0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((commitment0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={moneroStealthOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitment0 = resolvedEntity.commitment}
					{#if commitment0 !== undefined && commitment0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((commitment0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<MoneroTransactionView
						selection={select(EntityType.MoneroTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Output index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									outputIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outputIndex = resolvedEntity.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								<NumberValue
									value={outputIndex}
								/>
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
							publicKey: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							commitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitment = resolvedEntity.commitment}
					{#if commitment !== undefined && commitment !== null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue value={String((commitment) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
