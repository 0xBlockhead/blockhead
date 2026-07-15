<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.MoneroKeyImage>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.MoneroKeyImage>>
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
	const moneroKeyImage = $derived(selection({
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))
	const titleFallback = $derived([String((pendingEntity.keyImage) ?? '')].filter(Boolean).join(' ') || 'monero key image')
	const viewDomId = $derived('monero-key-image-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroKeyImage}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={moneroKeyImage}>
			{#snippet Pending()}
				{@const keyImage0 = pendingEntity.keyImage}
				{#if keyImage0 !== undefined && keyImage0 !== null}
					<TruncatedValue value={String((keyImage0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const keyImage0 = resolvedEntity.keyImage}
				{#if keyImage0 !== undefined && keyImage0 !== null}
					<TruncatedValue value={String((keyImage0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroKeyImage}>
			{#snippet Pending()}
				{@const inputIndex0 = pendingEntity.inputIndex}
				{#if inputIndex0 !== undefined && inputIndex0 !== null}
					<NumberValue value={Number(inputIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const inputIndex0 = resolvedEntity.inputIndex}
				{#if inputIndex0 !== undefined && inputIndex0 !== null}
					<NumberValue value={Number(inputIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroKeyImage}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={
						selection.$ring({
							sources: [
								Source.MoneroDaemonRpc_JsonRpc,
							],
						})
					}
				>
					{#snippet children(moneroRing)}
						{#if moneroRing != null && moneroRing[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MoneroRingView
									selection={select(EntityType.MoneroRing, moneroRing[EntityMetaKey.Selector])}
									prefetched={moneroRing}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection.$ring({
							sources: [
								Source.MoneroDaemonRpc_JsonRpc,
							],
						})
					}
				>
					{#snippet children(moneroRing)}
						{#if moneroRing != null && moneroRing[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<MoneroRingView
									selection={select(EntityType.MoneroRing, moneroRing[EntityMetaKey.Selector])}
									prefetched={moneroRing}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
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
				<dt>Input index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									inputIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const inputIndex = pendingEntity.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								<NumberValue value={Number(inputIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const inputIndex = resolvedEntity.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								<NumberValue value={Number(inputIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Key image</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keyImage: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keyImage = pendingEntity.keyImage}
							{#if keyImage !== undefined && keyImage !== null}
								<TruncatedValue value={String((keyImage) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keyImage = resolvedEntity.keyImage}
							{#if keyImage !== undefined && keyImage !== null}
								<TruncatedValue value={String((keyImage) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection.$ring({
						sources: [
							Source.MoneroDaemonRpc_JsonRpc,
						],
					})
				}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(moneroRing)}
					{#if moneroRing != null && moneroRing[EntityMetaKey.Selector] != null}
						<div>
							<dt>Ring</dt>
							<dd>
								<MoneroRingView
									selection={select(EntityType.MoneroRing, moneroRing[EntityMetaKey.Selector])}
									prefetched={moneroRing}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
