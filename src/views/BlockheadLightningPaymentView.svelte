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
		'paymentHash',
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'paymentHash',
				{
					label: 'latest status',
				},
				'valueMsat',
				{
					label: 'latest fee msat',
				},
			],
			[
				'createdAtMs',
				{
					label: 'latest failure reason',
				},
				{
					label: 'latest preimage status',
				},
				'paymentIndex',
				'$invoice',
			],
			[
				'paymentRequest',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'latest payment lifecycle observation',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'timestamped payment lifecycle observations',
					},
				],
			},
			{
				label: 'Local node',
				items: [
					{
						label: 'connected Lightning node state',
					},
				],
			},
			{
				label: 'Invoice',
				items: [
					{
						label: 'linked local invoice when resolved',
					},
				],
			},
			{
				label: 'Payment request',
				items: [
					{
						label: 'full BOLT11 string when present',
					},
				],
			},
			{
				label: 'Result',
				items: [
					{
						label: 'status',
					},
					{
						label: 'failure reason',
					},
					{
						label: 'preimage',
					},
					{
						label: 'fee',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Lightning network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'LND payment identity/request payload',
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
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningPayment>
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
	entityType={EntityType.BlockheadLightningPayment}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
