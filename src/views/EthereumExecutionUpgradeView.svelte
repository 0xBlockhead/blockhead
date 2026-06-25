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
		'$network',
		'name',
		'slug',
	],
	content: {
		dl: [
			[
				'$network',
				'name',
				'slug',
				'protocol',
				'layer',
			],
			[
				{
					label: 'activation block/timestamp/epoch',
				},
				'forkHash',
				'$$proposals',
				{
					label: 'links',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network upgrade',
				items: [
					{
						label: 'joined execution/consensus network-upgrade row when linked',
					},
				],
			},
			{
				label: 'Activation evidence',
				items: [
					{
						label: 'JSON-RPC/fork catalog evidence',
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
				label: 'Execution specs',
				items: [
					{
						label: 'pinned markdown filename',
					},
					{
						label: 'mainnet upgrade markdown when sourced',
					},
				],
			},
			{
				label: 'References',
				items: [
					{
						label: 'catalog URLs only',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'proposals',
			label: 'proposals',
			field: '$$proposals',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EthereumExecutionUpgrade>
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
	entityType={EntityType.EthereumExecutionUpgrade}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
