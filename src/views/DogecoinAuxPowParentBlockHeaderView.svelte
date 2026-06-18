<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.DogecoinAuxPowParentBlockHeader>
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
	entityType={EntityType.DogecoinAuxPowParentBlockHeader}
	entitySelector={selector}
	title={'Dogecoin AuxPoW Parent Header'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Dogecoin AuxPoW Parent Header
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.DogecoinAuxPowParentBlockHeader,
					selector,
					({ fields: { hash: true, merkleRoot: true, nonce: true } }),
				)}
			placeholderText={`Loading Dogecoin AuxPoW Parent Header...`}
		>
			{#snippet children(dogecoinAuxPowParentBlockHeader)}
				<dl>
					{#if dogecoinAuxPowParentBlockHeader.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={dogecoinAuxPowParentBlockHeader.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if dogecoinAuxPowParentBlockHeader.fields.merkleRoot != null}
						<div>
							<dt>Merkle Root</dt>
							<dd>
								<TruncatedValue
									value={dogecoinAuxPowParentBlockHeader.fields.merkleRoot}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if dogecoinAuxPowParentBlockHeader.fields.nonce != null}
						<div>
							<dt>Nonce</dt>
							<dd><NumberValue value={dogecoinAuxPowParentBlockHeader.fields.nonce} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
