<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.ZeroGServiceProvider>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceProvider}
	entitySelector={selector}
	title={selector.providerId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue
			value={selector.providerId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>A 0G service provider offers serving, inference, or related AI service capacity with verifiable settlement metadata.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={select(EntityType.ZeroGServiceProvider, selector, ({ fields: { serviceKind: true, $operator: true, verificationMethod: true, $$requests: true } }))}
			placeholderText="Loading 0G service provider…"
		>
			{#snippet children(serviceProvider)}
				<dl>
					{#if serviceProvider.fields.serviceKind != null}
						<div>
							<dt>Service</dt>
							<dd>{serviceProvider.fields.serviceKind}</dd>
						</div>
					{/if}

					{#if serviceProvider.fields.$operator != null}
						<div>
							<dt>Operator</dt>
							<dd>
								<EvmAccountView
									selector={serviceProvider.fields.$operator[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}

					{#if serviceProvider.fields.verificationMethod != null}
						<div>
							<dt>Verification</dt>
							<dd>{serviceProvider.fields.verificationMethod}</dd>
						</div>
					{/if}

					{#if serviceProvider.fields.$$requests != null && serviceProvider.fields.$$requests.values.length}
						<div>
							<dt>Requests</dt>
							<dd>
								<ul>
									{#each serviceProvider.fields.$$requests.values as request (request[EntityMetaKey.Selector].requestId)}
										<li>
											<ZeroGServiceRequestView
												selector={request[EntityMetaKey.Selector]}
												layout={EntityLayout.Title}

											/>
										</li>
									{/each}
								</ul>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
