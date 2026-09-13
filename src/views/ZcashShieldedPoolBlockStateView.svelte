<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.ZcashShieldedPoolBlockState>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)
	const zcashShieldedPoolBlockState = $derived(selection({
		fields: {
			saplingTree: true,
			orchardTree: true,
		},
	}))
	const titleFallback = 'zcash shielded pool block state'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPoolBlockState}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/shielded-pool/[pool=stringSegment]',
				{
					network: (
						block.$network.caip2 !== undefined ?
							caip2StringFromValue(block.$network.caip2)
						:
							block.$network.slug
					),
					blockNumber: String(block.height),
					pool: selection.entitySelector.$pool.pool,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ZcashShieldedPoolView
			selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zcashShieldedPoolBlockState}>
			{#snippet children(entity)}
				{[entity.saplingTree == null ? '' : `${entity.saplingTree.finalRoot} / ${entity.saplingTree.finalState}`, entity.orchardTree == null ? '' : `${entity.orchardTree.finalRoot} / ${entity.orchardTree.finalState}`].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>pool</dt>
				<dd>
					<ZcashShieldedPoolView
						selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={zcashShieldedPoolBlockState}
			>
				{#snippet children(entity)}
					{@const saplingTree = entity.saplingTree}
					{#if saplingTree != null}
						<div>
							<dt>Sapling tree</dt>
							<dd>
								{`${saplingTree.finalRoot} / ${saplingTree.finalState}`}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={zcashShieldedPoolBlockState}
			>
				{#snippet children(entity)}
					{@const orchardTree = entity.orchardTree}
					{#if orchardTree != null}
						<div>
							<dt>Orchard tree</dt>
							<dd>
								{`${orchardTree.finalRoot} / ${orchardTree.finalState}`}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
