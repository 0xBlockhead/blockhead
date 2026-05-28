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
			entityId: EntityId<typeof schema, EntityType.SolanaAccount>
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

	const solanaAccount = useEntity(
		EntityType.SolanaAccount,
		entityId,
		{
			lamports: {},
			rentEpoch: {},
			executable: {},
			dataEncoding: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
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

	{#snippet Heading()}
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
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
