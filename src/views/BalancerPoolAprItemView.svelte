<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BalancerPoolAprItem>, 'prefetched'> = $props()

	const pool = $derived(selection.entitySelector.$pool)
	const balancerPoolAprItem = $derived(selection({
		sources: selection.sources ?? [
			Source.Balancer_Rest,
		],
		fields: {
			apr: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BalancerPoolView from '$/views/BalancerPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.BalancerPoolAprItem}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.title || 'Balancer pool APR item')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/balancer-pool/[poolId=stringSegment]/(balancerPool)/apr/[title=stringSegment]/[aprType=stringSegment]',
				{
					network: (
						'caip2' in pool.$network ?
							caip2StringFromValue(pool.$network.caip2)
						:
							pool.$network.slug
					),
					poolId: pool.poolId,
					title: selection.entitySelector.title,
					aprType: selection.entitySelector.aprType,
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
		<ResourceBoundary resource={balancerPoolAprItem}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.apr}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.aprType}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<BalancerPoolView
						selection={select(EntityType.BalancerPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Title</dt>
				<dd>
					{selection.entitySelector.title}
				</dd>
			</div>

			<div>
				<dt>APR type</dt>
				<dd>
					{selection.entitySelector.aprType}
				</dd>
			</div>

			<div>
				<dt>APR</dt>
				<dd>
					<ResourceBoundary
						resource={balancerPoolAprItem}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.apr}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
