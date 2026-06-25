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
				'blockHeight',
				{
					label: 'balance',
				},
			],
			[
				{
					label: 'transaction count',
				},
				{
					label: 'bandwidth usage/limit',
				},
				{
					label: 'energy usage/limit',
				},
				{
					label: 'TRON Power usage/limit',
				},
				{
					label: 'contract flag',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Account',
				items: [
					{
						label: 'parent account identity',
					},
				],
			},
			{
				label: 'Resources',
				items: [
					{
						label: 'bandwidth',
					},
					{
						label: 'energy',
					},
					{
						label: 'TRON Power',
					},
					{
						label: 'TRC-10 asset bandwidth maps when source-backed',
					},
				],
			},
			{
				label: 'Contract',
				items: [
					{
						label: 'contract identity when contract flag/ref exists',
					},
				],
			},
			{
				label: 'Source',
				items: [
					{
						label: 'getaccount/getaccountresource/indexer payload freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.TronAccount_Timestamp>
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
	entityType={EntityType.TronAccount_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
