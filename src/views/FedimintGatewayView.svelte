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
		'gatewayId',
		'apiUrl',
		'nodePubkey',
	],
	content: {
		dl: [
			[
				'gatewayId',
				'apiUrl',
				'nodePubkey',
				{
					label: 'latest Lightning alias',
				},
				{
					label: 'latest version',
				},
			],
			[
				{
					label: 'latest routing-fee summary',
				},
				{
					label: 'connected federation count',
				},
				{
					label: 'latest liquidity/health status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Federations',
				items: [
					{
						label: 'Fedimint federations known to this gateway',
					},
				],
			},
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest gateway operational observation',
					},
				],
			},
			{
				label: 'Observations',
				items: [
					{
						label: 'timestamped gateway operational observations',
					},
				],
			},
			{
				label: 'Lightning',
				items: [
					'nodePubkey',
					{
						label: 'alias',
					},
					{
						label: 'channels',
					},
					{
						label: 'fee settings when source-backed',
					},
				],
			},
			{
				label: 'Management',
				items: [
					{
						label: 'admin-only config fields only in trusted local contexts',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'federations',
			label: 'federations',
			field: '$$federations',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.FedimintGateway>
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
	entityType={EntityType.FedimintGateway}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
