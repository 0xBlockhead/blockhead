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
		'height',
		'hash',
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				'height',
				'hash',
				{
					label: 'parent',
				},
				{
					label: 'timestamp',
				},
				'difficulty',
				{
					label: 'weight',
				},
				{
					label: 'transaction count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Header',
				items: [
					{
						label: 'parent',
					},
					'difficulty',
					{
						label: 'weight',
					},
					{
						label: 'timestamp',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Monero transactions in this block',
					},
				],
			},
			{
				label: 'Lookup evidence',
				items: [
					{
						label: 'get_block height lookup',
					},
					{
						label: 'get_block hash lookup',
					},
					{
						label: 'block header height/hash tuple',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Monero network',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroBlock>
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
	entityType={EntityType.MoneroBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
