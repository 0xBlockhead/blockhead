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
			label: 'block hash',
		},
		{
			label: 'timestamp',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'block hash',
				},
				{
					label: 'timestamp',
				},
				{
					label: 'blue score',
				},
				{
					label: 'DAA score',
				},
				{
					label: 'selected parent',
				},
				{
					label: 'parent count',
				},
				{
					label: 'merge-set blue/red counts',
				},
				{
					label: 'accepted transaction count',
				},
				{
					label: 'UTXO commitment',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Parents',
				items: [
					{
						label: 'parent blocks by hash',
					},
				],
			},
			{
				label: 'Merge-set blues',
				items: [
					{
						label: 'blue merge-set blocks',
					},
				],
			},
			{
				label: 'Merge-set reds',
				items: [
					{
						label: 'red merge-set blocks',
					},
				],
			},
			{
				label: 'Accepted transactions',
				items: [
					{
						label: 'transactions accepted by this block',
					},
				],
			},
			{
				label: 'Header roots',
				items: [
					{
						label: 'hash merkle root',
					},
					{
						label: 'accepted-id merkle root',
					},
					{
						label: 'UTXO commitment',
					},
				],
			},
			{
				label: 'DAG context',
				items: [
					{
						label: 'virtual-chain observations that added/removed this block',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaBlock>
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
	entityType={EntityType.KaspaBlock}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
