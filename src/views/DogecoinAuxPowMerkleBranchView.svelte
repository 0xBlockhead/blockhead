<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.branchKind}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.branchKind.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { branchHashes: true, index: true } }),
				)}
			placeholderText={`Loading Dogecoin AuxPoW Merkle Branch...`}
		>
			{#snippet children(dogecoinAuxPowMerkleBranch)}
				<dl>
					{#if dogecoinAuxPowMerkleBranch.branchHashes?.values.length}
						<div>
							<dt>Branch Hashes</dt>
							<dd>
								<ul>
									{#each dogecoinAuxPowMerkleBranch.branchHashes.values as branchHashes (branchHashes)}
										<li>
											<TruncatedValue
												value={branchHashes}
												format={TruncatedValueFormat.Abbr}
											/></li>
									{/each}
								</ul>
							</dd>
						</div>
					{/if}

					{#if dogecoinAuxPowMerkleBranch.index != null}
						<div>
							<dt>Index</dt>
							<dd><NumberValue value={dogecoinAuxPowMerkleBranch.index} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
