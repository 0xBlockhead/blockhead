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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaProgram>
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
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaProgram}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.programId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selection.entitySelector.programId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { name: true, $programAccount: true, $upgradeAuthority: true } })}
			placeholderText={`Loading Solana Program...`}
		>
			{#snippet children(solanaProgram)}
				<dl>
					{#if solanaProgram.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{solanaProgram.fields.name}</dd>
						</div>
					{/if}

					{#if solanaProgram.fields.$programAccount}
						<div>
							<dt>Program account</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaProgram.fields.$programAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
					{/if}

					{#if solanaProgram.fields.$upgradeAuthority}
						<div>
							<dt>Upgrade authority</dt>
							<dd>
								<SolanaAccountView
									selection={select(EntityType.SolanaAccount, solanaProgram.fields.$upgradeAuthority[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

									open={false}
									/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
