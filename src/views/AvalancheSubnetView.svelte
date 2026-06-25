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
		'subnetId',
		'label',
		'threshold',
	],
	content: {
		dl: [
			[
				'subnetId',
				'label',
				'threshold',
				{
					label: 'owner address count',
				},
				'controlKeys',
			],
			[
				{
					label: 'chain count',
				},
				'$$validators',
				'$$delegators',
				{
					label: 'latest total stake',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Blockchains',
				items: [
					{
						label: 'blockchains in this subnet',
					},
				],
			},
			{
				label: 'Validators',
				items: [
					{
						label: 'validator intervals for this subnet',
					},
				],
			},
			{
				label: 'Delegators',
				items: [
					{
						label: 'delegator intervals for this subnet',
					},
				],
			},
			{
				label: 'Control keys',
				items: [
					{
						label: 'threshold/owner/control-key list',
					},
				],
			},
			{
				label: 'State observations',
				items: [
					{
						label: 'timestamped subnet stake/count observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getSubnets/getCurrentValidators payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'blockchains',
			label: 'blockchains',
			field: '$$blockchains',
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
		{
			id: 'delegators',
			label: 'delegators',
			field: '$$delegators',
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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheSubnet>
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
	entityType={EntityType.AvalancheSubnet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
