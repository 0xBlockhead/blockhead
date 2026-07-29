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
	}: EntitySelectionViewProps<EntityType.FilecoinSector> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
		],
	}))
	const filecoinSector = $derived(viewSelection({
		fields: {
			sealedCid: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinMinerView from '$/views/FilecoinMinerView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinSector}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.sectorNumber)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.sectorNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<FilecoinMinerView
			selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinSector}>
			{#snippet children(entity)}
				{@const sealedCid = entity.sealedCid}
				{#if sealedCid != null}
					<span data-text="muted">
						{sealedCid}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Miner</dt>
				<dd>
					<FilecoinMinerView
						selection={select(EntityType.FilecoinMiner, selection.entitySelector.$miner)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Sector number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.sectorNumber}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={filecoinSector}
			>
				{#snippet children(entity)}
					{@const sealedCid = entity.sealedCid}
					{#if sealedCid != null}
						<div>
							<dt>Sealed CID</dt>
							<dd>
								{sealedCid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							activationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activationEpoch = entity.activationEpoch}
					{#if activationEpoch != null}
						<div>
							<dt>Activation epoch</dt>
							<dd>
								<NumberValue
									value={activationEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expirationEpoch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirationEpoch = entity.expirationEpoch}
					{#if expirationEpoch != null}
						<div>
							<dt>Expiration epoch</dt>
							<dd>
								<NumberValue
									value={expirationEpoch}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
