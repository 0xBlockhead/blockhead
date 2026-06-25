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
		'subnetId',
		{
			label: 'latest subnet kind',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'subnetId',
				{
					label: 'latest subnet kind',
				},
				{
					label: 'public key',
				},
				{
					label: 'latest replica version',
				},
			],
			[
				{
					label: 'latest node count',
				},
				{
					label: 'latest canister count',
				},
				{
					label: 'latest certified height',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Hosted canisters',
				items: [
					{
						label: 'canisters hosted on this subnet',
					},
				],
			},
			{
				label: 'Canister ranges',
				items: [
					{
						label: 'timestamped canister-range routing observations',
					},
				],
			},
			{
				label: 'Node/replica observations',
				items: [
					{
						label: 'timestamped subnet registry/status observations',
					},
				],
			},
			{
				label: 'Certified-state evidence',
				items: [
					{
						label: 'certificate/witness rows for canisters on this subnet',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent ICP network',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'registry subnet record payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'canister-ranges',
			label: 'canister ranges',
			field: '$$canisterRanges',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'canisters',
			label: 'canisters',
			field: '$$canisters',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpSubnet>
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
	entityType={EntityType.IcpSubnet}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
