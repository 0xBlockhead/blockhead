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
		'canisterId',
		{
			label: 'latest subnet',
		},
		{
			label: 'latest canister kind',
		},
	],
	content: {
		dl: [
			[
				'canisterId',
				{
					label: 'latest subnet',
				},
				{
					label: 'latest canister kind',
				},
				{
					label: 'latest module hash',
				},
				{
					label: 'latest status',
				},
			],
			[
				{
					label: 'cycles balance',
				},
				{
					label: 'controller count',
				},
				'$$methods',
				'$$certifiedStates',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Methods',
				items: [
					{
						label: 'callable method/interface rows',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'public custom-section metadata rows',
					},
				],
			},
			{
				label: 'Certified states',
				items: [
					{
						label: 'certificate/witness rows',
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
				label: 'Logs',
				items: [
					{
						label: 'caller-authorized log observations',
					},
				],
			},
			{
				label: 'Lifecycle/state history',
				items: [
					{
						label: 'timestamped canister status/settings observations',
					},
				],
			},
			{
				label: 'Ledger surface',
				items: [
					{
						label: 'ledger canister row when canister exposes ledger methods',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'canister info/status payloads',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'methods',
			label: 'methods',
			field: '$$methods',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'metadata',
			label: 'metadatases',
			field: '$$metadata',
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
			id: 'certified-states',
			label: 'certified states',
			field: '$$certifiedStates',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanister>
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
	entityType={EntityType.IcpCanister}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
