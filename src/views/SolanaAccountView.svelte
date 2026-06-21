<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaAccount}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.pubkey}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.pubkey}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { $ownerProgram: true, lamports: true, rentEpoch: true, executable: true, dataEncoding: true } }),
				)}
			placeholderText={`Loading Solana Account...`}
		>
			{#snippet children(solanaAccount)}
				<dl>
					{#if solanaAccount.$ownerProgram}
						<div>
							<dt>Owner program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaAccount.$ownerProgram[EntityMetaKey.Selector])}
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
