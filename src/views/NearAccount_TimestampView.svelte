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
		'timestampMs',
		'source',
	],
	content: {
		dl: [
			[
				'$account',
				'timestampMs',
				'source',
				{
					label: 'block height/hash',
				},
				{
					label: 'balance',
				},
			],
			[
				{
					label: 'locked balance',
				},
				'storageUsageBytes',
				'codeHash',
				'deleted',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent NEAR account',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'NEAR block when block selector resolves',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'contract code state when code hash is non-empty',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'view_account/account_changes/indexer payload',
					},
					{
						label: 'freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.NearAccount_Timestamp>
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
	entityType={EntityType.NearAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
