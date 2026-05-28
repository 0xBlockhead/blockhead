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
			entityId: EntityId<typeof schema, EntityType.MoneroStealthOutput>
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

	const moneroStealthOutput = useEntity(
		EntityType.MoneroStealthOutput,
		entityId,
		{
			publicKey: {},
			commitment: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroStealthOutput}
	{entityId}
	title={`Monero Stealth Output ${entityId.outputIndex.toString()}`}
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
			resource={moneroStealthOutput}
			placeholderText={`Loading Monero Stealth Output...`}
		>
			{#snippet children(moneroStealthOutput)}
				<dl>
					{#if moneroStealthOutput.publicKey != null}
						<div>
							<dt>Public Key</dt>
							<dd>
								<TruncatedValue
									value={moneroStealthOutput.publicKey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if moneroStealthOutput.commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue
									value={moneroStealthOutput.commitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
