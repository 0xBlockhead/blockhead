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
		'operatorAddress',
		'moniker',
	],
	content: {
		dl: [
			[
				'$network',
				'operatorAddress',
				'consensusPubkey',
				'moniker',
			],
			[
				{
					label: 'latest jailed/status/tokens snapshot',
				},
				'$$delegations',
				{
					label: 'description links',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Validator snapshots',
				items: [
					{
						label: 'timestamped validator stake/status observations',
					},
				],
			},
			{
				label: 'Delegations',
				items: [
					{
						label: 'delegations to this validator',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Cosmos network',
					},
				],
			},
			{
				label: 'Consensus identity',
				items: [
					'consensusPubkey',
					{
						label: 'proposer mapping when source-backed',
					},
				],
			},
			{
				label: 'Description',
				items: [
					{
						label: 'identity/website/security-contact/details',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'delegations',
			label: 'delegations',
			field: '$$delegations',
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosValidator>
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
	entityType={EntityType.CosmosValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
