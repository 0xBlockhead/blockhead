<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinMessageFee>, 'prefetched'> = $props()

	const message = $derived(selection.entitySelector.$message)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Filfox_Rest,
		],
	}))
	const filecoinMessageFee = $derived(viewSelection({
		fields: {
			minerTip: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FilecoinMessageView from '$/views/FilecoinMessageView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinMessageFee}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.source || 'filecoin message fee')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/message/filecoin/[cid=stringSegment]/(filecoinMessage)/fee/[source=stringSegment]',
				{
					network: (
						'caip2' in message.$network ?
							caip2StringFromValue(message.$network.caip2)
						:
							message.$network.slug
					),
					cid: message.cid,
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={filecoinMessageFee}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.minerTip}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<FilecoinMessageView
				selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Message</dt>
				<dd>
					<FilecoinMessageView
						selection={select(EntityType.FilecoinMessage, selection.entitySelector.$message)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Base fee burn</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									baseFeeBurn: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.baseFeeBurn}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Over-estimation burn</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									overEstimationBurn: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.overEstimationBurn}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Miner penalty</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									minerPenalty: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.minerPenalty}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Miner tip</dt>
				<dd>
					<ResourceBoundary
						resource={filecoinMessageFee}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.minerTip}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Refund</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									refund: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.refund}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
