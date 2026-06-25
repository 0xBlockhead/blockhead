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
		'credential',
		'credentialKind',
	],
	content: {
		dl: [
			[
				'$network',
				'credential',
				'credentialKind',
				'rewardAddress',
				{
					label: 'latest registered flag',
				},
			],
			[
				{
					label: 'latest active pool',
				},
				{
					label: 'latest active DRep',
				},
				'$$delegationEpochs',
				{
					label: 'address count',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Delegation history',
				items: [
					{
						label: 'epoch-bounded stake/DRep delegation rows',
					},
				],
			},
			{
				label: 'Addresses',
				items: [
					{
						label: 'Cardano addresses sharing the credential',
					},
				],
			},
			{
				label: 'Active pool',
				items: [
					{
						label: 'stake pool from latest delegation epoch',
					},
				],
			},
			{
				label: 'Active DRep',
				items: [
					{
						label: 'DRep from latest delegation epoch',
					},
				],
			},
			{
				label: 'Rewards',
				items: [
					{
						label: 'epoch reward fields when sourced',
					},
				],
			},
			{
				label: 'Certificates',
				items: [
					{
						label: 'registration/delegation/withdrawal certificate effects',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'delegation-epochs',
			label: 'delegation epochs',
			field: '$$delegationEpochs',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'addresses',
			label: 'addresses',
			field: '$$addresses',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoStakeCredential>
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
	entityType={EntityType.CardanoStakeCredential}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
