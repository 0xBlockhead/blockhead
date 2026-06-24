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
			label: 'blockchain id',
		},
		{
			label: 'subnet',
		},
		{
			label: 'VM id',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'blockchain id',
				},
				{
					label: 'subnet',
				},
				{
					label: 'VM id',
				},
				{
					label: 'chain name/alias',
				},
				{
					label: 'linked Network',
				},
				{
					label: 'genesis data hash',
				},
				{
					label: 'creation transaction',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subnet',
				items: [
					{
						label: 'parent subnet',
					},
				],
			},
			{
				label: 'Validators',
				items: [
					{
						label: 'validators through subnet membership',
					},
				],
			},
			{
				label: 'Creation transaction',
				items: [
					{
						label: 'P-Chain creation transaction when resolved',
					},
				],
			},
			{
				label: 'Genesis/source evidence',
				items: [
					{
						label: 'genesis data hash',
					},
					{
						label: 'aliases',
					},
					{
						label: 'source payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheBlockchain>
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
	entityType={EntityType.AvalancheBlockchain}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
