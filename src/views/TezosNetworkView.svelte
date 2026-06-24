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
			label: 'linked base Network',
		},
		{
			label: 'latest level',
		},
		{
			label: 'protocol hash',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				{
					label: 'latest level',
				},
				{
					label: 'protocol hash',
				},
				{
					label: 'cycle',
				},
				{
					label: 'total supply',
				},
				{
					label: 'active baker count',
				},
				{
					label: 'token count',
				},
				{
					label: 'indexer lag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blocks',
				items: [
					{
						label: 'Tezos block rows',
					},
				],
			},
			{
				label: 'Operation groups',
				items: [
					{
						label: 'operation group rows',
					},
				],
			},
			{
				label: 'Operations',
				items: [
					{
						label: 'Tezos operation rows',
					},
				],
			},
			{
				label: 'Accounts',
				items: [
					{
						label: 'Tezos account rows',
					},
				],
			},
			{
				label: 'Contracts',
				items: [
					{
						label: 'Tezos contract rows',
					},
				],
			},
			{
				label: 'Bakers',
				items: [
					{
						label: 'Tezos baker rows',
					},
				],
			},
			{
				label: 'Cycles/rights',
				items: [
					{
						label: 'cycle rows',
					},
					{
						label: 'baking right rows',
					},
				],
			},
			{
				label: 'Tokens',
				items: [
					{
						label: 'token rows',
					},
					{
						label: 'token transfer rows',
					},
				],
			},
			{
				label: 'Network history',
				items: [
					{
						label: 'timestamped network observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosNetwork>
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
	entityType={EntityType.TezosNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
