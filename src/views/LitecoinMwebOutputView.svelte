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
			selection: EntityProxyResource<typeof schema, EntityType.LitecoinMwebOutput>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LitecoinMwebOutput>>
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
	const litecoinMwebOutput = $derived(selection({
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
		fields: {
			commitment: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.commitment) ?? '')].filter(Boolean).join(' ') || 'litecoin MWEB output')
	const viewDomId = $derived('litecoin-mweb-output-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={litecoinMwebOutput}>
			{#snippet Pending()}
				{[String((prefetched.commitment) ?? '')].filter(Boolean).join(' ') || title || 'litecoin MWEB output'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.commitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={litecoinMwebOutput}>
			{#snippet Pending()}
				{@const outputIndex0 = selection.entitySelector.outputIndex ?? prefetched.outputIndex}
				{#if outputIndex0 !== undefined && outputIndex0 !== null}
					<NumberValue value={Number(outputIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const outputIndex0 = resolvedEntity.outputIndex}
				{#if outputIndex0 !== undefined && outputIndex0 !== null}
					<NumberValue value={Number(outputIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
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
								fields: {
									outputIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outputIndex = selection.entitySelector.outputIndex ?? prefetched.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								<NumberValue value={Number(outputIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outputIndex = resolvedEntity.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								<NumberValue value={Number(outputIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commitment = prefetched.commitment}
					{#if commitment !== undefined && commitment !== null}
						<div>
							<dt>commitment</dt>
							<dd>
								{String((commitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							senderPubkey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const senderPubkey = prefetched.senderPubkey}
					{#if senderPubkey !== undefined && senderPubkey !== null}
						<div>
							<dt>sender public key</dt>
							<dd>
								{String((senderPubkey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
