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
			selection: RegisteredEntityProxyResource<EntityType.LitecoinMwebOutput>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LitecoinMwebOutput>
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
	const litecoinMwebOutput = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			commitment: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			commitment: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.commitment) ?? '')].filter(Boolean).join(' ') || 'litecoin MWEB output')
	const viewDomId = $derived('litecoin-mweb-output-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebOutput}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'commitment') && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, '$mwebBlock') && prefetched.$transaction.$mwebBlock != null && Object.hasOwn(prefetched.$transaction.$mwebBlock, '$block') && prefetched.$transaction.$mwebBlock.$block != null && Object.hasOwn(prefetched.$transaction.$mwebBlock.$block, 'hash') && Object.hasOwn(prefetched.$transaction.$mwebBlock.$block, 'transactionCount') && Object.hasOwn(prefetched.$transaction.$mwebBlock, 'hogExTransactionId') && Object.hasOwn(prefetched.$transaction.$mwebBlock, 'kernelRoot') && Object.hasOwn(prefetched.$transaction, 'kernelOffset')}
			{[String((pendingEntity.commitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={litecoinMwebOutput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.commitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'commitment') && Object.hasOwn(prefetched, '$transaction') && prefetched.$transaction != null && Object.hasOwn(prefetched.$transaction, '$mwebBlock') && prefetched.$transaction.$mwebBlock != null && Object.hasOwn(prefetched.$transaction.$mwebBlock, '$block') && prefetched.$transaction.$mwebBlock.$block != null && Object.hasOwn(prefetched.$transaction.$mwebBlock.$block, 'hash') && Object.hasOwn(prefetched.$transaction.$mwebBlock.$block, 'transactionCount') && Object.hasOwn(prefetched.$transaction.$mwebBlock, 'hogExTransactionId') && Object.hasOwn(prefetched.$transaction.$mwebBlock, 'kernelRoot') && Object.hasOwn(prefetched.$transaction, 'kernelOffset')}
			{@const outputIndex0 = pendingEntity.outputIndex}
			{#if outputIndex0 !== undefined && outputIndex0 !== null}
				<NumberValue
					value={outputIndex0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={litecoinMwebOutput}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>output index</dt>
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
							<dt>commitment</dt>
							<dd>
								{String((commitment) ?? '')}
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
							senderPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const senderPubkey = resolvedEntity.senderPubkey}
					{#if senderPubkey !== undefined && senderPubkey !== null}
						<div>
							<dt>sender public key</dt>
							<dd>
								{String((senderPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
