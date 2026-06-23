<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'step index or tool label',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'step index or tool label',
					},
				],
				[
					{
						label: 'quote',
					},
					'index',
					{
						label: 'provider step id',
					},
					{
						label: 'step type',
					},
					{
						label: 'tool key/name',
					},
					{
						label: 'from/to EVM network refs',
					},
					{
						label: 'from/to token refs',
					},
					{
						label: 'amounts',
					},
					{
						label: 'estimated gas',
					},
					{
						label: 'rail',
					},
					{
						label: 'settlement model',
					},
					{
						label: 'verification model',
					},
					{
						label: 'asset outcome',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Quote',
					items: [
						{
							label: 'parent bridge route quote observation',
						},
					],
				},
				{
					label: 'Networks/tokens',
					items: [
						{
							label: 'mapped network',
						},
						{
							label: 'token refs',
						},
					],
				},
				{
					label: 'Estimate',
					items: [
						{
							label: 'amounts',
						},
						{
							label: 'gas',
						},
					],
				},
				{
					label: 'Tool classification',
					items: [
						{
							label: 'rail/settlement/verification/asset outcome',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'LI.FI includedSteps entry',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteQuoteStep>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.BridgeRouteQuoteStep}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
