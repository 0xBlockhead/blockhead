<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>
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
	entitySelector={selector}
	title={selector.branchKind}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selector.branchKind.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.DogecoinAuxPowMerkleBranch,
					selector,
					({ fields: { branchHashes: true, index: true } }),
				)}
			placeholderText={`Loading Dogecoin AuxPoW Merkle Branch...`}
		>
			{#snippet children(dogecoinAuxPowMerkleBranch)}
				<dl>
					{#if dogecoinAuxPowMerkleBranch.fields.branchHashes?.values.length}
						<div>
							<dt>Branch Hashes</dt>
							<dd>
								<ul>
									{#each dogecoinAuxPowMerkleBranch.fields.branchHashes.values as branchHashes (branchHashes)}
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

					{#if dogecoinAuxPowMerkleBranch.fields.index != null}
						<div>
							<dt>Index</dt>
							<dd><NumberValue value={dogecoinAuxPowMerkleBranch.fields.index} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
