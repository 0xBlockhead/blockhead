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
		'contractId',
		'evmAddress',
		'createdTimestamp',
	],
	content: {
		dl: [
			[
				'contractId',
				'evmAddress',
				'createdTimestamp',
				{
					label: 'latest linked account id',
				},
				{
					label: 'latest bytecode hash',
				},
			],
			[
				{
					label: 'deleted flag',
				},
				'$$results',
				'$$logs',
				{
					label: 'storage slot count',
				},
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest info',
				items: [
					{
						label: 'latest contract-info observation',
					},
				],
			},
			{
				label: 'Info history',
				items: [
					{
						label: 'timestamped contract-info observations',
					},
				],
			},
			{
				label: 'Call results',
				items: [
					{
						label: 'contract execution result rows',
					},
				],
			},
			{
				label: 'Actions',
				items: [
					{
						label: 'contract action trace rows',
					},
				],
			},
			{
				label: 'Logs',
				items: [
					{
						label: 'contract log rows',
					},
				],
			},
			{
				label: 'Storage slots',
				items: [
					{
						label: 'timestamped contract storage-slot observations',
					},
				],
			},
			{
				label: 'Verification metadata',
				items: [
					{
						label: 'verified source/ABI payloads when modeled',
					},
				],
			},
			{
				label: 'Transactions',
				items: [
					{
						label: 'related Hedera transactions',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'results',
			label: 'results',
			field: '$$results',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'logs',
			label: 'logs',
			field: '$$logs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'state',
			label: 'state',
			field: '$$state',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaContract>
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
	entityType={EntityType.HederaContract}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
