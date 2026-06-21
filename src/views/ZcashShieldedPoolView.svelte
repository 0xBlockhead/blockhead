<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedPool>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPool}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.pool}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.pool.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { activationNetworkUpgrade: true, noteProtocol: true } }),
				)}
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
