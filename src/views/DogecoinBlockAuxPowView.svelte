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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.DogecoinBlockAuxPow>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/aux-pow',
				{
					network: (
						'caip2' in block.$network ?
							caip2StringFromValue(block.$network.caip2)
						:
							block.$network.slug
					),
					blockNumber: String(block.height),
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
						href={null}
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
