<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SolanaProgram>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const solanaProgram = useEntity(entityCollectionsContext, EntityType.SolanaProgram,
		entityId,
		({ fields: { name: true, $programAccount: true, $upgradeAuthority: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaProgram}
	{entityId}
	title={entityId.programId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.programId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={solanaProgram}
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
									entityId={solanaProgram.fields.$programAccount[EntityMetaKey.Id]}
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
									entityId={solanaProgram.fields.$upgradeAuthority[EntityMetaKey.Id]}
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
