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
		'address',
		{
			label: 'paymaster contract',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'address',
				{
					label: 'paymaster contract',
				},
				{
					label: 'latest indexed user-operation count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'paymaster EVM contract',
					},
				],
			},
			{
				label: 'User operations',
				items: [
					{
						label: 'user operations whose paymaster/paymasterAndData resolves to this paymaster',
					},
				],
			},
			{
				label: 'Sponsorship evidence',
				items: [
					{
						label: 'sponsorType',
					},
					{
						label: 'paymasterAndData fields from linked operations',
					},
				],
			},
			{
				label: 'Count snapshots',
				items: [
					{
						label: 'timestamped paymaster count observations',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent EVM network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockscout paymaster detail/list payload',
					},
					{
						label: 'pagination context',
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
			id: 'user-operations',
			label: 'user operations',
			field: '$$userOperations',
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
			selection: EntityProxyResource<typeof schema, EntityType.Erc4337Paymaster>
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
	entityType={EntityType.Erc4337Paymaster}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
