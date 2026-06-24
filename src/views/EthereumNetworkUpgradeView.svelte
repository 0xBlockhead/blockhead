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
			label: 'network',
		},
		'name',
		'slug',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'name',
				'slug',
				{
					label: 'activation block/timestamp/epoch',
				},
				{
					label: 'execution upgrade',
				},
				{
					label: 'optional consensus upgrade',
				},
				{
					label: 'proposal count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					{
						label: 'linked execution upgrade row',
					},
				],
			},
			{
				label: 'Consensus',
				items: [
					{
						label: 'linked consensus upgrade row',
					},
				],
			},
			{
				label: 'Proposals',
				items: [
					{
						label: 'linked specification proposal rows',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network',
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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumNetworkUpgrade>
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
	entityType={EntityType.EthereumNetworkUpgrade}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
