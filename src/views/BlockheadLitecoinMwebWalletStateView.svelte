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
		'walletId',
		'$network',
		{
			label: 'latest MWEB address',
		},
	],
	content: {
		dl: [
			[
				'walletId',
				'$network',
				{
					label: 'latest MWEB address',
				},
				{
					label: 'latest transparent address',
				},
				{
					label: 'latest balance summary',
				},
				{
					label: 'latest scanned height',
				},
				'$$outputs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'BlockheadLitecoinMwebWalletState_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadLitecoinMwebWalletState_TimestampsView',
					},
				],
			},
			{
				label: 'Outputs',
				items: [
					{
						label: 'BlockheadLitecoinMwebOutputState list',
					},
				],
			},
			{
				label: 'Public MWEB blocks',
				items: [
					{
						label: 'LitecoinMwebBlock list at scanned heights',
					},
				],
			},
			{
				label: 'Peg flows',
				items: [
					{
						label: 'LitecoinMwebPegIn',
					},
					{
						label: 'LitecoinMwebPegOut rows involving exposed wallet outputs',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'outputs',
			label: 'outputs',
			field: '$$outputs',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLitecoinMwebWalletState>
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
	entityType={EntityType.BlockheadLitecoinMwebWalletState}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
