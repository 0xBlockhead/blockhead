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
		'scheduleId',
		{
			label: 'creator',
		},
		{
			label: 'payer',
		},
	],
	content: {
		dl: [
			[
				'scheduleId',
				{
					label: 'creator',
				},
				{
					label: 'payer',
				},
				{
					label: 'latest executed timestamp',
				},
				{
					label: 'deleted flag',
				},
			],
			[
				{
					label: 'expiration',
				},
				{
					label: 'wait-for-expiry',
				},
				'$$signatures',
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Scheduled transaction body',
				items: [
					{
						label: 'transactionBody JSON',
					},
				],
			},
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest schedule lifecycle observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped schedule lifecycle observations',
					},
				],
			},
			{
				label: 'Signatures',
				items: [
					{
						label: 'schedule signature rows',
					},
				],
			},
			{
				label: 'Execution transaction',
				items: [
					{
						label: 'executed Hedera transaction when available',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'signatures',
			label: 'signatures',
			field: '$$signatures',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaSchedule>
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
	entityType={EntityType.HederaSchedule}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
