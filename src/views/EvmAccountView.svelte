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
			label: 'global address identity',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'global address identity',
				},
				{
					label: 'primary ENS name',
				},
				{
					label: 'avatar URL/media when resolver-backed',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Identity',
				items: [
					'$$ensNamesOwned',
					{
						label: 'primary ENS name',
					},
					{
						label: 'resolver-backed avatar media or generated blockie fallback',
					},
				],
			},
			{
				label: 'Network accounts',
				items: [
					{
						label: 'per-chain EVM network accounts',
					},
				],
			},
			{
				label: 'Balances',
				items: [
					{
						label: 'network-actor coin balances when available',
					},
				],
			},
			{
				label: 'Activity',
				items: [
					{
						label: 'transactions',
					},
					{
						label: 'token transfers',
					},
					{
						label: 'internal transfers through network accounts',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'ens-names-owned',
			label: 'ENS names ownedses',
			field: '$$ensNamesOwned',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmAccount>
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
	entityType={EntityType.EvmAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
