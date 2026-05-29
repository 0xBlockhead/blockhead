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
			entityId: EntityId<typeof schema, EntityType.SolanaValidator>
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

	const solanaValidator = useEntity(
		EntityType.SolanaValidator,
		entityId,
		{
			nodePubkey: {},
			activatedStakeLamports: {},
			commission: {},
			delinquent: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaValidator}
	{entityId}
	title={entityId.votePubkey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.votePubkey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={solanaValidator}
			placeholderText={`Loading Solana Validator...`}
		>
			{#snippet children(solanaValidator)}
				<dl>
					{#if solanaValidator.nodePubkey != null}
						<div>
							<dt>Node Pubkey</dt>
							<dd>
								<TruncatedValue
									value={solanaValidator.nodePubkey}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if solanaValidator.activatedStakeLamports != null}
						<div>
							<dt>Activated Stake Lamports</dt>
							<dd><NumberValue value={solanaValidator.activatedStakeLamports} /> lamports</dd>
						</div>
					{/if}

					{#if solanaValidator.commission != null}
						<div>
							<dt>Commission</dt>
							<dd><NumberValue value={solanaValidator.commission} /></dd>
						</div>
					{/if}

					{#if solanaValidator.delinquent != null}
						<div>
							<dt>Delinquent</dt>
							<dd>{solanaValidator.delinquent ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
