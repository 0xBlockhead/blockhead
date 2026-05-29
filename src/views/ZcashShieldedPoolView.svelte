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
			entityId: EntityId<typeof schema, EntityType.ZcashShieldedPool>
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

	const zcashShieldedPool = useEntity(
		EntityType.ZcashShieldedPool,
		entityId,
		{
			activationNetworkUpgrade: {},
			noteProtocol: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPool}
	{entityId}
	title={entityId.pool}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{entityId.pool.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zcashShieldedPool}
			placeholderText="Loading Zcash shielded pool…"
		>
			{#snippet children(zcashShieldedPool)}
				<dl data-column-item="center">
					{#if zcashShieldedPool.activationNetworkUpgrade != null}
						<div>
							<dt>Activation upgrade</dt>
							<dd>{zcashShieldedPool.activationNetworkUpgrade}</dd>
						</div>
					{/if}

					{#if zcashShieldedPool.noteProtocol != null}
						<div>
							<dt>Note protocol</dt>
							<dd>{zcashShieldedPool.noteProtocol}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
