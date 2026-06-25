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
			label: 'token id',
		},
		{
			label: 'version',
		},
		'$mint',
	],
	content: {
		dl: [
			[
				{
					label: 'token id',
				},
				{
					label: 'version',
				},
				'$mint',
				'unit',
				'memo',
			],
			[
				'proofCount',
				'totalAmount',
				{
					label: 'imported time',
				},
				{
					label: 'redeemed time',
				},
				'status',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Proofs',
				items: [
					{
						label: 'BlockheadCashuProof list',
					},
				],
			},
			{
				label: 'Encoded token',
				items: [
					{
						label: 'redacted token string with local reveal/copy controls',
					},
				],
			},
			{
				label: 'Mint',
				items: [
					{
						label: 'CashuMintView',
					},
				],
			},
			{
				label: 'Import/redeem',
				items: [
					{
						label: 'local lifecycle',
					},
					{
						label: 'errors when captured',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'proofs',
			label: 'proofs',
			field: '$$proofs',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuToken>
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
	entityType={EntityType.BlockheadCashuToken}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
