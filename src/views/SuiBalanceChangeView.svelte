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
			selection: RegisteredEntityProxyResource<EntityType.SuiBalanceChange>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.SuiBalanceChange>>
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
	const suiBalanceChange = $derived(selection({}))
	const titleFallback = $derived('Sui balance change')
	const viewDomId = $derived('sui-balance-change-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiBalanceChange}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiBalanceChange}>
			{#snippet Pending()}
				{title || 'Sui balance change'}
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
				<dt>transaction</dt>
				<dd>
					<SuiTransactionView
						selection={select(EntityType.SuiTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>change index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									changeIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const changeIndex = pendingEntity.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								{String((changeIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const changeIndex = resolvedEntity.changeIndex}
							{#if changeIndex !== undefined && changeIndex !== null}
								{String((changeIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const coinType = pendingEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>coin type</dt>
							<dd>
								{String((coinType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const coinType = resolvedEntity.coinType}
					{#if coinType !== undefined && coinType !== null}
						<div>
							<dt>coin type</dt>
							<dd>
								{String((coinType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$coinType}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(suiCoinType)}
					{#if suiCoinType != null && suiCoinType[EntityMetaKey.Selector] != null}
						<div>
							<dt>coin type</dt>
							<dd>
								<SuiCoinTypeView
									selection={select(EntityType.SuiCoinType, suiCoinType[EntityMetaKey.Selector])}
									prefetched={suiCoinType}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>amount delta</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									amountDelta: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const amountDelta = pendingEntity.amountDelta}
							{#if amountDelta !== undefined && amountDelta !== null}
								{String((amountDelta) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amountDelta = resolvedEntity.amountDelta}
							{#if amountDelta !== undefined && amountDelta !== null}
								{String((amountDelta) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
