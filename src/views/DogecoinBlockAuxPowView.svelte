<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.DogecoinBlockAuxPow> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoBlockView from '$/views/UtxoBlockView.svelte'
	import DogecoinAuxPowParentBlockHeaderView from '$/views/DogecoinAuxPowParentBlockHeaderView.svelte'
	import DogecoinAuxPowMerkleBranchView from '$/views/DogecoinAuxPowMerkleBranchView.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinBlockAuxPow}
	entitySelector={selection.entitySelector}
	title={title ?? 'dogecoin block aux pow'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<UtxoBlockView
			selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$parentBlockHeader}
		>
			{#snippet children(dogecoinAuxPowParentBlockHeader)}
				{#if dogecoinAuxPowParentBlockHeader != null}
					<DogecoinAuxPowParentBlockHeaderView
						selection={select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector])}
						prefetched={dogecoinAuxPowParentBlockHeader}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<UtxoBlockView
						selection={select(EntityType.UtxoBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parentBlockHeader}
			>
				{#snippet children(dogecoinAuxPowParentBlockHeader)}
					{#if dogecoinAuxPowParentBlockHeader != null}
						<div>
							<dt>Parent block header</dt>
							<dd>
								<DogecoinAuxPowParentBlockHeaderView
									selection={select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector])}
									prefetched={dogecoinAuxPowParentBlockHeader}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$coinbaseBranch}
			>
				{#snippet children(dogecoinAuxPowMerkleBranch)}
					{#if dogecoinAuxPowMerkleBranch != null}
						<div>
							<dt>Coinbase branch</dt>
							<dd>
								<DogecoinAuxPowMerkleBranchView
									selection={select(EntityType.DogecoinAuxPowMerkleBranch, dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector])}
									prefetched={dogecoinAuxPowMerkleBranch}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$chainBranch}
			>
				{#snippet children(dogecoinAuxPowMerkleBranch)}
					{#if dogecoinAuxPowMerkleBranch != null}
						<div>
							<dt>Chain branch</dt>
							<dd>
								<DogecoinAuxPowMerkleBranchView
									selection={select(EntityType.DogecoinAuxPowMerkleBranch, dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector])}
									prefetched={dogecoinAuxPowMerkleBranch}
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
