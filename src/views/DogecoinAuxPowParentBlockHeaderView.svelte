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
			entityId: EntityId<typeof schema, EntityType.DogecoinAuxPowParentBlockHeader>
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

	const dogecoinAuxPowParentBlockHeader = useEntity(
		EntityType.DogecoinAuxPowParentBlockHeader,
		entityId,
		{
			hash: {},
			merkleRoot: {},
			nonce: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	{entityId}
	title={'Dogecoin AuxPoW Parent Header'}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Dogecoin AuxPoW Parent Header
	{/snippet}

	{#snippet Heading()}
		Dogecoin AuxPoW Parent Header
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={dogecoinAuxPowParentBlockHeader}
			placeholderText={`Loading Dogecoin AuxPoW Parent Header...`}
		>
			{#snippet children(dogecoinAuxPowParentBlockHeader)}
				<dl>
					{#if dogecoinAuxPowParentBlockHeader.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={dogecoinAuxPowParentBlockHeader.hash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if dogecoinAuxPowParentBlockHeader.merkleRoot != null}
						<div>
							<dt>Merkle Root</dt>
							<dd>
								<TruncatedValue
									value={dogecoinAuxPowParentBlockHeader.merkleRoot}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if dogecoinAuxPowParentBlockHeader.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={dogecoinAuxPowParentBlockHeader.nonce} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
