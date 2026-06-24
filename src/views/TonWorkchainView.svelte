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
		{
			label: 'workchain id',
		},
		'label',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'workchain id',
				},
				'label',
				{
					label: 'address format',
				},
				{
					label: 'transaction format',
				},
				{
					label: 'VM',
				},
				{
					label: 'shard count',
				},
				{
					label: 'block count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Shard history',
				items: [
					{
						label: 'shard/block observations',
					},
				],
			},
			{
				label: 'Blocks',
				items: [
					{
						label: 'blocks for this workchain',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'accounts filtered by workchain',
					},
				],
			},
			{
				label: 'Messages',
				items: [
					{
						label: 'messages touching this workchain',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonWorkchain>
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
	entityType={EntityType.TonWorkchain}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
