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
		{
			label: 'latest head snapshot',
		},
		{
			label: 'environment',
		},
	],
	content: {
		dl: [
			[
				'$network',
				{
					label: 'latest head snapshot',
				},
				{
					label: 'environment',
				},
				{
					label: 'native asset count',
				},
				'rpcEndpoints',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Monero',
				items: [
					'$$blocks',
					{
						label: 'Network snapshots',
					},
					{
						label: 'Endpoints',
					},
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'faucets',
					},
					{
						label: 'block explorers',
					},
				],
			},
			{
				label: 'Local wallets',
				items: [
					{
						label: 'BlockheadMoneroWalletState list when local wallet state exists',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'blocks',
			label: 'blocks',
			field: '$$blocks',
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
			selection: EntityProxyResource<typeof schema, EntityType.MoneroNetwork>
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
	entityType={EntityType.MoneroNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
