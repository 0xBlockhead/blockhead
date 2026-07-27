<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.AptosBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const aptosBlock = $derived(selection({
		fields: {
			height: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.height ?? '') || 'aptos block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aptosBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.height}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aptosBlock}>
			{#snippet children(entity)}
				<Timestamp timestamp={Number(entity.timestampMs)} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={aptosBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.height}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>first version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									firstVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.firstVersion}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>last version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									lastVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.lastVersion}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={aptosBlock}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.timestampMs)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const aptosBlockAptosTransactionsViewTransactionsResource = selection.$$transactions}
		<ResourceBoundary
			resource={aptosBlockAptosTransactionsViewTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AptosTransactionsView
						selection={aptosBlockAptosTransactionsViewTransactionsResource}
						countResource={aptosBlockAptosTransactionsViewTransactionsResource.count}
						title='transactions'
						id='transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
