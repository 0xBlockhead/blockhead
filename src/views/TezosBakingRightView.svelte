<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.TezosBakingRight> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'tezos baking right'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosBakerView from '$/views/TezosBakerView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBakingRight}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		tezos baking right
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>cycle</dt>
				<dd>
					{String(pendingEntity.cycle)}
				</dd>
			</div>

			<div>
				<dt>level</dt>
				<dd>
					{String(pendingEntity.level)}
				</dd>
			</div>

			<div>
				<dt>right kind</dt>
				<dd>
					{pendingEntity.rightKind}
				</dd>
			</div>

			<div>
				<dt>baker address</dt>
				<dd>
					<TruncatedValue value={pendingEntity.bakerAddress} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$baker}
			>
				{#snippet children(tezosBaker)}
					{#if tezosBaker != null}
						<div>
							<dt>baker</dt>
							<dd>
								<TezosBakerView
									selection={select(EntityType.TezosBaker, tezosBaker[EntityMetaKey.Selector])}
									prefetched={tezosBaker}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							round: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const round = entity.round}
					{#if round != null}
						<div>
							<dt>round</dt>
							<dd>
								{String(round)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							slots: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const slots = entity.slots}
					{#if slots != null}
						<div>
							<dt>slots</dt>
							<dd>
								{String(slots)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							priority: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priority = entity.priority}
					{#if priority != null}
						<div>
							<dt>priority</dt>
							<dd>
								{String(priority)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
