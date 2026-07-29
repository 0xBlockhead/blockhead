<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
	}: EntitySelectionViewProps<EntityType.ZcashShieldedPoolBlockState> = $props()

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
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ZcashShieldedPoolView
			selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zcashShieldedPoolBlockState}>
			{#snippet children(entity)}
				{[entity.saplingTree == null ? '' : `${entity.saplingTree.finalRoot} / ${entity.saplingTree.finalState}`, entity.orchardTree == null ? '' : `${entity.orchardTree.finalRoot} / ${entity.orchardTree.finalState}`].filter(Boolean).join(' ') || titleFallback}
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

			<div>
				<dt>pool</dt>
				<dd>
					<ZcashShieldedPoolView
						selection={select(EntityType.ZcashShieldedPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
						open={false}
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
