<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const dogecoinAuxPowMerkleBranch = useEntity(
		EntityType.DogecoinAuxPowMerkleBranch,
		entityId,
		{
			branchHashes: {},
			index: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowMerkleBranch}
	{entityId}
	title={entityId.branchKind}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.branchKind.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={dogecoinAuxPowMerkleBranch}
			placeholderText={`Loading Dogecoin AuxPoW Merkle Branch...`}
		>
			{#snippet children(dogecoinAuxPowMerkleBranch)}
				<dl>
					{#if dogecoinAuxPowMerkleBranch.branchHashes != null}
						<div>
							<dt>Branch Hashes</dt>
							<dd>
								<ul>
									{#each dogecoinAuxPowMerkleBranch.branchHashes as branchHashes (branchHashes)}
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
