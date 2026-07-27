<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LitecoinMwebBlock> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LitecoinCore_JsonRpc,
		],
	}))
	const litecoinMwebBlock = $derived(viewSelection({
		fields: {
			hogExTransactionId: true,
			kernelRoot: true,
		},
	}))
	const titleFallback = 'litecoin MWEB block'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionsView from '$/views/LitecoinMwebTransactionsView.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<UtxoBlockView
			selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
			href=""
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={litecoinMwebBlock}>
			{#snippet children(entity)}
				{(entity.hogExTransactionId ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebBlock}>
			{#snippet children(entity)}
				{@const kernelRoot0 = entity.kernelRoot}
				{#if kernelRoot0 != null}
					<span data-text="muted">
						{kernelRoot0}
					</span>
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
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={litecoinMwebBlock}
			>
				{#snippet children(entity)}
					{@const hogExTransactionId = entity.hogExTransactionId}
					{#if hogExTransactionId != null}
						<div>
							<dt>hog ex transaction ID</dt>
							<dd>
								{hogExTransactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={litecoinMwebBlock}
			>
				{#snippet children(entity)}
					{@const kernelRoot = entity.kernelRoot}
					{#if kernelRoot != null}
						<div>
							<dt>kernel root</dt>
							<dd>
								{kernelRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const litecoinMwebBlockLitecoinMwebTransactionsViewTransactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={litecoinMwebBlockLitecoinMwebTransactionsViewTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LitecoinMwebTransactionsView
						selection={litecoinMwebBlockLitecoinMwebTransactionsViewTransactionsResource}
						countResource={litecoinMwebBlockLitecoinMwebTransactionsViewTransactionsResource.count}
						title='transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
