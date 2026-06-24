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
			label: 'latest virtual selected parent',
		},
		{
			label: 'pruning point',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				{
					label: 'latest virtual selected parent',
				},
				{
					label: 'pruning point',
				},
				{
					label: 'virtual DAA score',
				},
				{
					label: 'virtual blue score',
				},
				{
					label: 'indexed transaction count',
				},
				{
					label: 'UTXO-index availability',
				},
				{
					label: 'server version',
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
						label: 'Kaspa block rows',
					},
				],
			},
			{
				label: 'Accepted transactions',
				items: [
					{
						label: 'accepted transaction rows',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'Kaspa transaction rows',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'Kaspa address rows',
					},
				],
			},
			{
				label: 'Virtual-chain history',
				items: [
					{
						label: 'timestamped virtual-chain movement observations',
					},
				],
			},
			{
				label: 'Network timestamp history',
				items: [
					{
						label: 'timestamped DAG head/indexer/node observations',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaNetwork>
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
	entityType={EntityType.KaspaNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
