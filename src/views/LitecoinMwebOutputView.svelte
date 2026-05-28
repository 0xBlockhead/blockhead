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
			entityId: EntityId<typeof schema, EntityType.LitecoinMwebOutput>
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

	const litecoinMwebOutput = useEntity(
		EntityType.LitecoinMwebOutput,
		entityId,
		{
			commitment: {},
			senderPubkey: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebOutput}
	{entityId}
	title={`Litecoin MWEB Output ${entityId.outputIndex.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.outputIndex.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.outputIndex.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={litecoinMwebOutput}
			placeholderText={`Loading Litecoin MWEB Output...`}
		>
			{#snippet children(litecoinMwebOutput)}
				<dl>
					{#if litecoinMwebOutput.commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebOutput.commitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if litecoinMwebOutput.senderPubkey != null}
						<div>
							<dt>Sender Pubkey</dt>
							<dd>
								<TruncatedValue
									value={litecoinMwebOutput.senderPubkey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
