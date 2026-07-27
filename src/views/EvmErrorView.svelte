<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmError> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Openchain_Rest,
		],
	}))
	const evmError = $derived(viewSelection({
		fields: {
			signatures: true,
		},
	}))
	const titleFallback = 'EVM error'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmError_TimestampsView from '$/views/EvmError_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmError}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]',
			{
				hex: String(selection.entitySelector.hex),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={evmError}
			placeholderText="Loading decoded error selector..."
		>
			{#snippet Pending()}
				{selection.entitySelector.hex}
			{/snippet}

			{#snippet children(entity)}
				{entity.signatures.values[0] ?? selection.entitySelector.hex}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{selection.entitySelector.hex}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Selector</dt>
				<dd>
					<TruncatedValue value={String(pendingEntity.hex)} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								signatures: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						<div>
							<dt>Signatures</dt>
							<dd>
								{#if entity.signatures.values.length}
									<ul>
										{#each entity.signatures.values as signature (signature)}
											<li><code>{signature}</code></li>
										{/each}
									</ul>
								{:else}
									<p data-text="muted">No catalog matches for this revert/error selector.</p>
								{/if}
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const evmErrorEvmErrorTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={evmErrorEvmErrorTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmError_TimestampsView
						selection={evmErrorEvmErrorTimestampsViewTimestampsResource}
						countResource={evmErrorEvmErrorTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
