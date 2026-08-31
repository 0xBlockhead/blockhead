<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosBakingRight_Timestamp>, 'prefetched'> = $props()

	const right = $derived(selection.entitySelector.$right)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TezosBakingRightView from '$/views/TezosBakingRightView.svelte'
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBakingRight_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/baking-right/[cycle=nonNegativeBigInt]/[level=nonNegativeBigInt]/[rightKind=stringSegment]/[bakerAddress=stringSegment]/[rightSource=stringSegment]/(tezosBakingRight)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in right.$network.$network ?
							caip2StringFromValue(right.$network.$network.caip2)
						:
							right.$network.$network.slug
					),
					cycle: String(right.cycle),
					level: String(right.level),
					rightKind: right.rightKind,
					bakerAddress: right.bakerAddress,
					rightSource: right.source,
					timestampMs: String(selection.entitySelector.timestampMs),
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
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>right</dt>
				<dd>
					<TezosBakingRightView
						selection={select(EntityType.TezosBakingRight, selection.entitySelector.$right)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							estimatedTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const estimatedTimeMs = entity.estimatedTimeMs}
					{#if estimatedTimeMs != null}
						<div>
							<dt>estimated time ms</dt>
							<dd>
								{estimatedTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(tezosBlock)}
					{#if tezosBlock != null}
						<div>
							<dt>block</dt>
							<dd>
								<TezosBlockView
									selection={select(EntityType.TezosBlock, tezosBlock[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
