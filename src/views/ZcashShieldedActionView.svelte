<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ZcashShieldedAction>
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

	const zcashShieldedAction = useEntity(
		EntityType.ZcashShieldedAction,
		entityId,
		{
			actionKind: {},
			...open && {
				valueCommitment: {},
				$case: {
					actionKind: {
						[ZcashShieldedActionKind.Spend]: {
							nullifier: {},
						},
						[ZcashShieldedActionKind.Output]: {
							noteCommitment: {},
						},
						[ZcashShieldedActionKind.Action]: {
							nullifier: {},
							noteCommitment: {},
						},
					},
				},
			},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedAction}
	{entityId}
	title={`Shielded action #${entityId.actionIndex.toString()}`}
	idDragPlainText={entityId.actionIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.actionIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Shielded action </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zcashShieldedAction}
			placeholderText="Loading Zcash shielded action…"
		>
			{#snippet children(zcashShieldedAction)}
				<dl data-column-item="center">
					{#if zcashShieldedAction.actionKind != null}
						<div>
							<dt>Kind</dt>
							<dd>{zcashShieldedAction.actionKind}</dd>
						</div>
					{/if}

					{#if (
						open
						&& (
							zcashShieldedAction.actionKind === ZcashShieldedActionKind.Spend
							|| zcashShieldedAction.actionKind === ZcashShieldedActionKind.Action
						)
						&& zcashShieldedAction.nullifier != null
					)}
						<div>
							<dt>Nullifier</dt>
							<dd>{zcashShieldedAction.nullifier}</dd>
						</div>
					{/if}

					{#if (
						open
						&& (
							zcashShieldedAction.actionKind === ZcashShieldedActionKind.Output
							|| zcashShieldedAction.actionKind === ZcashShieldedActionKind.Action
						)
						&& zcashShieldedAction.noteCommitment != null
					)}
						<div>
							<dt>Note Commitment</dt>
							<dd>
								<TruncatedValue
									value={zcashShieldedAction.noteCommitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if open && zcashShieldedAction.valueCommitment != null}
						<div>
							<dt>Value Commitment</dt>
							<dd>
								<TruncatedValue
									value={zcashShieldedAction.valueCommitment}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
