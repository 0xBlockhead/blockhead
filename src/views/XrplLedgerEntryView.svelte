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
			label: 'entry type',
		},
		{
			label: 'entry hash',
		},
		{
			label: 'ledger',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'entry type',
				},
				{
					label: 'entry hash',
				},
				{
					label: 'ledger',
				},
				'account',
				{
					label: 'previous transaction hash/index',
				},
				{
					label: 'changed-by transaction links',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Ledger',
				items: [
					{
						label: 'parent XRPL ledger',
					},
				],
			},
			{
				label: 'Entry fields',
				items: [
					{
						label: 'raw fields',
					},
					{
						label: 'entry type',
					},
				],
			},
			{
				label: 'Account',
				items: [
					{
						label: 'account when present',
					},
				],
			},
			{
				label: 'History',
				items: [
					{
						label: 'previous transaction hash/index',
					},
					{
						label: 'changed-by transaction links',
					},
				],
			},
			{
				label: 'Type-specific panels',
				items: [
					{
						label: 'rendered panels when implemented',
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
			selection: EntityProxyResource<typeof schema, EntityType.XrplLedgerEntry>
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
	entityType={EntityType.XrplLedgerEntry}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
