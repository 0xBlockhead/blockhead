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
		'caip2',
		'$network',
		'environment',
	],
	content: {
		dl: [
			[
				'caip2',
				'$network',
				'environment',
				{
					label: 'latest head snapshot',
				},
				{
					label: 'endpoint count',
				},
			],
			[
				{
					label: 'bounded recent account count',
				},
				{
					label: 'bounded transaction count',
				},
				'$$validators',
				{
					label: 'token mint entry points',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution',
				items: [
					'$$blocks',
					'$$transactions',
					'$$accounts',
					{
						label: 'Network snapshots',
					},
					{
						label: 'Endpoints',
					},
				],
			},
			{
				label: 'Consensus & Block Production',
				items: [
					'$$validators',
				],
			},
			{
				label: 'Assets',
				items: [
					{
						label: 'native coin',
					},
					{
						label: 'token mints from selectors or parsed token-account state',
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
					{
						label: 'source coverage',
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
		{
			id: 'transactions',
			label: 'transactions',
			field: '$$transactions',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'accounts',
			label: 'accounts',
			field: '$$accounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'token-accounts',
			label: 'token accounts',
			field: '$$tokenAccounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'token-mints',
			label: 'token mints',
			field: '$$tokenMints',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'validators',
			label: 'validators',
			field: '$$validators',
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
			selection: EntityProxyResource<typeof schema, EntityType.SolanaNetwork>
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
	entityType={EntityType.SolanaNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
