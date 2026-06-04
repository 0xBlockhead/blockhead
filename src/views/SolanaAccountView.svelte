<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SolanaAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const solanaAccount = useEntity(
		EntityType.SolanaAccount,
		entityId,
		{
			$ownerProgram: {},
			lamports: {},
			rentEpoch: {},
			executable: {},
			dataEncoding: {},
		},
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaAccount}
	{entityId}
	title={entityId.pubkey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.pubkey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={solanaAccount}
			placeholderText={`Loading Solana Account...`}
		>
			{#snippet children(solanaAccount)}
				<dl>
					{#if solanaAccount.$ownerProgram}
						<div>
							<dt>Owner program</dt>
							<dd>
								<SolanaProgramView
									entityId={solanaAccount.$ownerProgram[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if solanaAccount.lamports != null}
						<div>
							<dt>Lamports</dt>
							<dd><NumberValue value={solanaAccount.lamports} /></dd>
						</div>
					{/if}

					{#if solanaAccount.rentEpoch != null}
						<div>
							<dt>Rent Epoch</dt>
							<dd><NumberValue value={solanaAccount.rentEpoch} /></dd>
						</div>
					{/if}

					{#if solanaAccount.executable != null}
						<div>
							<dt>Executable</dt>
							<dd>{solanaAccount.executable ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if solanaAccount.dataEncoding != null}
						<div>
							<dt>Data Encoding</dt>
							<dd>
								<TruncatedValue
									value={solanaAccount.dataEncoding}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
