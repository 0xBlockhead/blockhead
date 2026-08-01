<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadCashuMintQuote>, 'prefetched'> = $props()

	const blockheadCashuMintQuote = $derived(selection({
		fields: {
			amount: true,
			unit: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuMintQuote_TimestampsView from '$/views/BlockheadCashuMintQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMintQuote}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.quoteId || 'blockhead Cashu mint quote')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadCashuMintQuote}>
			{#snippet children(entity)}
				{@const amount = entity.amount}
				{#if amount != null}
					<NumberValue
						value={amount}
					/>

					<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>method</dt>
				<dd>
					{selection.entitySelector.method}
				</dd>
			</div>

			<div>
				<dt>quote ID</dt>
				<dd>
					{selection.entitySelector.quoteId}
				</dd>
			</div>

			<div>
				<dt>request</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									request: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.request}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletState}
			>
				{#snippet children(blockheadCashuWalletState)}
					{#if blockheadCashuWalletState != null}
						<div>
							<dt>wallet state</dt>
							<dd>
								<BlockheadCashuWalletStateView
									selection={select(EntityType.BlockheadCashuWalletState, blockheadCashuWalletState[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadCashuMintQuote}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>

								<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuMintQuote_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
