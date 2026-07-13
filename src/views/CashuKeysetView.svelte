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
			selection: EntityProxyResource<typeof schema, EntityType.CashuKeyset>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CashuKeyset>>
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
	const cashuKeyset = $derived(selection({
		sources: [
			Source.CashuMint_Rest,
		],
		fields: {
			unit: true,
			active: true,
			inputFeePpk: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.keysetId) ?? '')].filter(Boolean).join(' ') || 'Cashu keyset')
	const viewDomId = $derived('cashu-keyset-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
</script>


<EntityView
	entityType={EntityType.CashuKeyset}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet Pending()}
				{@const keysetId0 = pendingEntity.keysetId}
				{#if keysetId0 !== undefined && keysetId0 !== null}
					<TruncatedValue value={String((keysetId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const keysetId0 = resolvedEntity.keysetId}
				{#if keysetId0 !== undefined && keysetId0 !== null}
					<TruncatedValue value={String((keysetId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet Pending()}
				{[String((pendingEntity.unit) ?? ''), String((pendingEntity.active) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.keysetId) ?? '')].filter(Boolean).join(' ') || title || 'Cashu keyset'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.unit) ?? ''), String((resolvedEntity.active) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.keysetId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cashuKeyset}>
			{#snippet Pending()}
				{@const inputFeePpk0 = pendingEntity.inputFeePpk}
				{#if inputFeePpk0 !== undefined && inputFeePpk0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(inputFeePpk0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const inputFeePpk0 = resolvedEntity.inputFeePpk}
				{#if inputFeePpk0 !== undefined && inputFeePpk0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(inputFeePpk0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>keyset ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									keysetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const keysetId = pendingEntity.keysetId}
							{#if keysetId !== undefined && keysetId !== null}
								<TruncatedValue value={String((keysetId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const keysetId = resolvedEntity.keysetId}
							{#if keysetId !== undefined && keysetId !== null}
								<TruncatedValue value={String((keysetId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							unit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unit = pendingEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unit = resolvedEntity.unit}
					{#if unit !== undefined && unit !== null}
						<div>
							<dt>unit</dt>
							<dd>
								{String((unit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = pendingEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.CashuMint_Rest,
						],
						fields: {
							inputFeePpk: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const inputFeePpk = pendingEntity.inputFeePpk}
					{#if inputFeePpk !== undefined && inputFeePpk !== null}
						<div>
							<dt>input fee ppk</dt>
							<dd>
								<NumberValue value={Number(inputFeePpk)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputFeePpk = resolvedEntity.inputFeePpk}
					{#if inputFeePpk !== undefined && inputFeePpk !== null}
						<div>
							<dt>input fee ppk</dt>
							<dd>
								<NumberValue value={Number(inputFeePpk)} />
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
							Source.CashuMint_Rest,
						],
						fields: {
							keysByAmountJson: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keysByAmountJson = pendingEntity.keysByAmountJson}
					{#if keysByAmountJson !== undefined && keysByAmountJson !== null}
						<div>
							<dt>keys by amount JSON</dt>
							<dd>
								{String((keysByAmountJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keysByAmountJson = resolvedEntity.keysByAmountJson}
					{#if keysByAmountJson !== undefined && keysByAmountJson !== null}
						<div>
							<dt>keys by amount JSON</dt>
							<dd>
								{String((keysByAmountJson) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
