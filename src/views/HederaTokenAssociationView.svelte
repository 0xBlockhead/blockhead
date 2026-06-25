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
		'$account',
		'$token',
		{
			label: 'latest association state',
		},
	],
	content: {
		dl: [
			[
				'$account',
				'$token',
				{
					label: 'latest association state',
				},
				{
					label: 'latest balance',
				},
				{
					label: 'KYC status',
				},
				{
					label: 'freeze status',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Relationship-state history',
				items: [
					{
						label: 'timestamped association/balance observations',
					},
				],
			},
			{
				label: 'Transfers',
				items: [
					{
						label: 'token transfers for this account/token',
					},
				],
			},
			{
				label: 'NFT holdings',
				items: [
					{
						label: 'NFT serial rows for this account/token',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTokenAssociation>
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
	entityType={EntityType.HederaTokenAssociation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
