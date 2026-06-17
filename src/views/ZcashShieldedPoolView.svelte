<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ZcashShieldedPool>
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
	entitySelector={selector}
	title={selector.pool}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selector.pool.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.ZcashShieldedPool,
					selector,
					({ fields: { activationNetworkUpgrade: true, noteProtocol: true } }),
				)}
			placeholderText="Loading Zcash shielded pool…"
		>
			{#snippet children(zcashShieldedPool)}
				<dl data-column-item="center">
					{#if zcashShieldedPool.fields.activationNetworkUpgrade != null}
						<div>
							<dt>Activation upgrade</dt>
							<dd>{zcashShieldedPool.fields.activationNetworkUpgrade}</dd>
						</div>
					{/if}

					{#if zcashShieldedPool.fields.noteProtocol != null}
						<div>
							<dt>Note protocol</dt>
							<dd>{zcashShieldedPool.fields.noteProtocol}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
