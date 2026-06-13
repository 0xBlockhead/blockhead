<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	const solanaAccount = subscribe(EntityType.SolanaAccount,
		entityId,
		({ fields: { $ownerProgram: true, lamports: true, rentEpoch: true, executable: true, dataEncoding: true } }),
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
					{#if solanaAccount.fields.$ownerProgram}
						<div>
							<dt>Owner program</dt>
							<dd>
								<SolanaProgramView
									entityId={solanaAccount.fields.$ownerProgram[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if solanaAccount.fields.lamports != null}
						<div>
							<dt>Lamports</dt>
							<dd><NumberValue value={solanaAccount.fields.lamports} /></dd>
						</div>
					{/if}

					{#if solanaAccount.fields.rentEpoch != null}
						<div>
							<dt>Rent Epoch</dt>
							<dd><NumberValue value={solanaAccount.fields.rentEpoch} /></dd>
						</div>
					{/if}

					{#if solanaAccount.fields.executable != null}
						<div>
							<dt>Executable</dt>
							<dd>{solanaAccount.fields.executable ? 'Yes' : 'No'}</dd>
						</div>
					{/if}

					{#if solanaAccount.fields.dataEncoding != null}
						<div>
							<dt>Data Encoding</dt>
							<dd>
								<TruncatedValue
									value={solanaAccount.fields.dataEncoding}
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
