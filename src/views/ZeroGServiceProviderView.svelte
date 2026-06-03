<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			entityId: EntityId<typeof schema, EntityType.ZeroGServiceProvider>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const serviceProvider = useEntity(
		EntityType.ZeroGServiceProvider,
		entityId,
		{
			serviceKind: {},
			operatorAddress: {},
			verificationMethod: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceProvider}
	{entityId}
	title={entityId.providerId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={entityId.providerId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A 0G service provider offers serving, inference, or related AI service capacity with verifiable settlement metadata.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={serviceProvider}
			placeholderText="Loading 0G service provider…"
		>
			{#snippet children(serviceProvider)}
				<dl>
					{#if serviceProvider.serviceKind != null}
						<div>
							<dt>Service</dt>
							<dd>{serviceProvider.serviceKind}</dd>
						</div>
					{/if}

					{#if serviceProvider.operatorAddress != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<TruncatedValue
									value={serviceProvider.operatorAddress}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if serviceProvider.verificationMethod != null}
						<div>
							<dt>Verification</dt>
							<dd>{serviceProvider.verificationMethod}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
