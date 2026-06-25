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
		'ledgerIndex',
		'source',
	],
	content: {
		dl: [
			[
				'$account',
				'ledgerIndex',
				'source',
				'timestampMs',
				{
					label: 'account balance',
				},
			],
			[
				'ownerCount',
				'sequence',
				'flags',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'XrplAccount',
					},
				],
			},
			{
				label: 'Ledger state',
				items: [
					'balanceDrops',
					'ownerCount',
					'sequence',
					'flags',
				],
			},
			{
				label: 'Ledger context',
				items: [
					'ledgerIndex',
					'timestampMs',
					'source',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'account_info/explorer account payload',
					},
				],
			},
		],
	},
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XrplAccount_Timestamp>
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
	entityType={EntityType.XrplAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
