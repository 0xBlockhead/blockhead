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
			label: 'latest registry version',
		},
		'$$subnets',
	],
	content: {
		dl: [
			[
				{
					label: 'linked base Network',
				},
				{
					label: 'latest registry version',
				},
				'$$subnets',
				'$$canisters',
				{
					label: 'boundary node count',
				},
				{
					label: 'root-key hash',
				},
				{
					label: 'certification summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Subnets',
				items: [
					{
						label: 'ICP subnet rows',
					},
				],
			},
			{
				label: 'Canisters',
				items: [
					{
						label: 'ICP canister rows',
					},
				],
			},
			{
				label: 'Ledger canisters',
				items: [
					{
						label: 'ledger-interface canister rows',
					},
				],
			},
			{
				label: 'Request statuses',
				items: [
					{
						label: 'ingress request-status rows',
					},
				],
			},
			{
				label: 'Certified-state proofs',
				items: [
					{
						label: 'certificate/witness rows grouped by canister',
					},
				],
			},
			{
				label: 'Timestamp history',
				items: [
					{
						label: 'timestamped network registry/status observations',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'registry',
					},
					{
						label: 'status',
					},
					{
						label: 'dashboard payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'subnets',
			label: 'subnets',
			field: '$$subnets',
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
			id: 'ledger-canisters',
			label: 'ledger canisters',
			field: '$$ledgerCanisters',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'request-statuses',
			label: 'request statuses',
			field: '$$requestStatuses',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpNetwork>
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
	entityType={EntityType.IcpNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
