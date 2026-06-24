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
			label: 'route',
		},
		{
			label: 'step index',
		},
		'tool',
	],
	content: {
		dl: [
			[
				{
					label: 'route',
				},
				{
					label: 'step index',
				},
				{
					label: 'step type',
				},
				'tool',
			],
			[
				{
					label: 'from/to network refs',
				},
				{
					label: 'from/to token refs',
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
				label: 'Route',
				items: [
					{
						label: 'parent BridgeRoute quote row',
					},
				],
			},
			{
				label: 'Networks/tokens',
				items: [
					{
						label: 'mapped EVM network and coin-instance refs',
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
					{
						label: 'local tool classification catalog',
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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeRouteStep>
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
	entityType={EntityType.BridgeRouteStep}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
